export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5068";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object") {
      const record = body as Record<string, unknown>;
      if (typeof record.message === "string") return record.message;
      if (record.errors && typeof record.errors === "object") {
        const messages = Object.values(record.errors as Record<string, unknown>)
          .flat()
          .filter((m): m is string => typeof m === "string");
        if (messages.length) return messages.join(" ");
      }
    }
  } catch {
    // response had no JSON body
  }
  return `Đã có lỗi xảy ra (mã ${res.status}).`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) throw new ApiError(await extractErrorMessage(res), res.status);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function withAuth(token: string): RequestInit {
  return { headers: { Authorization: `Bearer ${token}` } };
}

// ---- Types (mirror backend/Nails.Api/Dtos) ----

export interface ServiceDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  imageUrl: string | null;
  categoryId: number;
}

export interface ServiceCategoryDto {
  id: number;
  name: string;
  description: string | null;
  services: ServiceDto[];
}

export interface StaffDto {
  id: number;
  fullName: string;
  bio: string | null;
  specialty: string | null;
  avatarUrl: string | null;
}

export interface GalleryItemDto {
  id: number;
  imageUrl: string;
  title: string | null;
  style: string | null;
  serviceId: number | null;
  isFeatured: boolean;
}

export type UserRole = "Customer" | "Staff" | "Admin";

export interface UserDto {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  role: UserRole;
  loyaltyPoints: number;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserDto;
}

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  password: string;
  email?: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled" | "NoShow";

export interface BookingItemDto {
  serviceId: number;
  serviceName: string;
  price: number;
  durationMinutes: number;
}

export interface BookingDto {
  id: number;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  staffId: number | null;
  staffName: string | null;
  note: string | null;
  items: BookingItemDto[];
}

export interface CreateBookingRequest {
  startTime: string;
  staffId?: number;
  serviceIds: number[];
  note?: string;
}

// ---- Catalog (public) ----

export const getCategories = () => request<ServiceCategoryDto[]>("/api/services/categories");

export const getServices = () => request<ServiceDto[]>("/api/services");

export const getStaff = () => request<StaffDto[]>("/api/staff");

export const getGallery = (style?: string) =>
  request<GalleryItemDto[]>(`/api/gallery${style ? `?style=${encodeURIComponent(style)}` : ""}`);

// ---- Auth ----

export const registerUser = (data: RegisterRequest) =>
  request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) });

export const loginUser = (data: LoginRequest) =>
  request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(data) });

// ---- Bookings (require auth) ----

export const createBooking = (data: CreateBookingRequest, token: string) =>
  request<BookingDto>("/api/bookings", { method: "POST", body: JSON.stringify(data), ...withAuth(token) });

export const getMyBookings = (token: string) => request<BookingDto[]>("/api/bookings/me", withAuth(token));

export const cancelBooking = (id: number, token: string) =>
  request<void>(`/api/bookings/${id}/cancel`, { method: "POST", ...withAuth(token) });
