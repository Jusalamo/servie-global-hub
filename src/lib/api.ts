
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type ServiceCategory = Database["public"]["Tables"]["service_categories"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Review = Database["public"]["Tables"]["reviews"]["Row"];
type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
type Notification = Database["public"]["Tables"]["notifications"]["Row"];
type ServiceImage = Database["public"]["Tables"]["service_images"]["Row"];

// Service categories
export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching service categories:", error);
    throw error;
  }

  return data || [];
};

// Services
export const getServices = async (filters?: {
  categoryId?: string;
  providerId?: string;
  featured?: boolean;
  search?: string;
}): Promise<Service[]> => {
  let query = supabase.from("services").select("*");

  // Apply filters if provided
  if (filters?.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters?.providerId) {
    query = query.eq("provider_id", filters.providerId);
  }

  if (filters?.featured !== undefined) {
    query = query.eq("featured", filters.featured);
  }

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching services:", error);
    throw error;
  }

  return data || [];
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null;
    }
    console.error("Error fetching service by ID:", error);
    throw error;
  }

  return data;
};

export const createService = async (service: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service> => {
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select()
    .single();

  if (error) {
    console.error("Error creating service:", error);
    throw error;
  }

  return data;
};

export const updateService = async (id: string, service: Partial<Omit<Service, "id" | "created_at" | "updated_at">>): Promise<Service> => {
  const { data, error } = await supabase
    .from("services")
    .update(service)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating service:", error);
    throw error;
  }

  return data;
};

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};

// Service Images
export const getServiceImages = async (serviceId: string): Promise<ServiceImage[]> => {
  const { data, error } = await supabase
    .from("service_images")
    .select("*")
    .eq("service_id", serviceId)
    .order("is_primary", { ascending: false });

  if (error) {
    console.error("Error fetching service images:", error);
    throw error;
  }

  return data || [];
};

export const addServiceImage = async (image: Omit<ServiceImage, "id" | "created_at" | "updated_at">): Promise<ServiceImage> => {
  const { data, error } = await supabase
    .from("service_images")
    .insert(image)
    .select()
    .single();

  if (error) {
    console.error("Error adding service image:", error);
    throw error;
  }

  return data;
};

export const setPrimaryServiceImage = async (imageId: string, serviceId: string): Promise<void> => {
  // First, set all images for this service as not primary
  const { error: resetError } = await supabase
    .from("service_images")
    .update({ is_primary: false })
    .eq("service_id", serviceId);

  if (resetError) {
    console.error("Error resetting primary images:", resetError);
    throw resetError;
  }

  // Then set the selected image as primary
  const { error } = await supabase
    .from("service_images")
    .update({ is_primary: true })
    .eq("id", imageId)
    .eq("service_id", serviceId);

  if (error) {
    console.error("Error setting primary image:", error);
    throw error;
  }
};

export const deleteServiceImage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("service_images")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting service image:", error);
    throw error;
  }
};

// User profiles
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null;
    }
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data;
};

export const updateUserProfile = async (userId: string, profile: Partial<Omit<Profile, "id" | "created_at" | "updated_at" | "role">>): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
};

// Bookings
export const getBookingsByClient = async (clientId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client bookings:", error);
    throw error;
  }

  return data || [];
};

export const getBookingsByProvider = async (providerId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services!inner(*)")
    .eq("services.provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching provider bookings:", error);
    throw error;
  }

  return data || [];
};

export const createBooking = async (booking: Omit<Booking, "id" | "created_at" | "updated_at">): Promise<Booking> => {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    throw error;
  }

  return data;
};

export const updateBookingStatus = async (bookingId: string, status: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }

  return data;
};

// Reviews
export const getServiceReviews = async (serviceId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles!client_id(*)")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching service reviews:", error);
    throw error;
  }

  return data || [];
};

export const getClientReviews = async (clientId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client reviews:", error);
    throw error;
  }

  return data || [];
};

export const getProviderReviews = async (providerId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching provider reviews:", error);
    throw error;
  }

  return data || [];
};

export const createReview = async (review: Omit<Review, "id" | "created_at" | "updated_at">): Promise<Review> => {
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    throw error;
  }

  return data;
};

export const updateReviewResponse = async (reviewId: string, providerResponse: string): Promise<Review> => {
  const { data, error } = await supabase
    .from("reviews")
    .update({ provider_response: providerResponse })
    .eq("id", reviewId)
    .select()
    .single();

  if (error) {
    console.error("Error updating review response:", error);
    throw error;
  }

  return data;
};

// Favorites
export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*, services(*)")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }

  return data || [];
};

export const addFavorite = async (clientId: string, serviceId: string): Promise<Favorite> => {
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      client_id: clientId,
      service_id: serviceId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }

  return data;
};

export const removeFavorite = async (clientId: string, serviceId: string): Promise<void> => {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("client_id", clientId)
    .eq("service_id", serviceId);

  if (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

// Notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }

  return data || [];
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// File uploads
export const uploadServiceImage = async (
  file: File,
  providerId: string,
  serviceId: string
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${providerId}/${serviceId}/${Math.random()}.${fileExt}`;
  const filePath = `service-images/${fileName}`;

  const { error } = await supabase.storage
    .from("service-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }

  const { data } = supabase.storage.from("service-images").getPublicUrl(filePath);
  return data.publicUrl;
};
