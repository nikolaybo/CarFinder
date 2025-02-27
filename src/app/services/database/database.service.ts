import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  async addFavorite(userId: string | undefined, carId: string) {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, car_id: carId }]);

    if (error) console.error('Error adding favorite:', error);
  }

  async removeFavorite(userId: string | undefined, carId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('car_id', carId);

    if (error) console.error('Error removing favorite:', error);
  }

  async getUserFavorites(userId: string | undefined) {
    if (!userId) {
      console.error("Error: userId is empty or undefined.");
      return [];
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('car_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data.map(fav => fav.car_id); // Extract only car IDs
  }

   /**
   * Get paginated cars from the database
   * @param page Page number (starts from 1)
   * @param pageSize Number of cars per page
   */
   async getCarsPaginated(page: number, pageSize: number) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('model', { ascending: true }) // Sort by model name (change as needed)
      .range(from, to); // Apply pagination

    if (error) {
      console.error('Error fetching cars:', error);
      return [];
    }

    return data;
  }

  async getCarsByIds(carIds: string[]): Promise<any[]> {
    if (!carIds.length) return [];

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .in('id', carIds); // Fetch all cars whose ID is in the provided array

    if (error) {
      console.error('Error fetching favorite cars:', error);
      return [];
    }

    return data;
  }

  async searchCars(query: string) {
    if (!query.trim()) return []; // Return empty if no query

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .or(`model.ilike.%${query}%`) // Search by model or description

    if (error) {
      console.error('Error searching cars:', error);
      return [];
    }

    return data;
  }
}
