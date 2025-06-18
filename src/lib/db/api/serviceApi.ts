import { Service, IService } from '../models';
import connectToDatabase from '../mongodb';

/**
 * Create a new service
 */
export async function createService(serviceData: Partial<IService>) {
  try {
    await connectToDatabase();
    const service = new Service(serviceData);
    await service.save();
    return service;
  } catch (error: any) {
    console.error('Error creating service:', error);
    throw new Error(`Failed to create service: ${error.message}`);
  }
}

/**
 * Get service by ID
 */
export async function getServiceById(id: string) {
  try {
    await connectToDatabase();
    const service = await Service.findById(id);
    return service;
  } catch (error: any) {
    console.error('Error getting service:', error);
    throw new Error(`Failed to get service: ${error.message}`);
  }
}

/**
 * Update service
 */
export async function updateService(id: string, updateData: Partial<IService>) {
  try {
    await connectToDatabase();
    const service = await Service.findByIdAndUpdate(id, updateData, { new: true });
    return service;
  } catch (error: any) {
    console.error('Error updating service:', error);
    throw new Error(`Failed to update service: ${error.message}`);
  }
}

/**
 * Delete service
 */
export async function deleteService(id: string) {
  try {
    await connectToDatabase();
    await Service.findByIdAndDelete(id);
    return true;
  } catch (error: any) {
    console.error('Error deleting service:', error);
    throw new Error(`Failed to delete service: ${error.message}`);
  }
}

/**
 * List all services with pagination
 */
export async function listServices(page = 1, limit = 10, filter: any = {}) {
  try {
    await connectToDatabase();
    const skip = (page - 1) * limit;
    
    const services = await Service.find(filter)
      .populate('categoryId')
      .sort({ popularityScore: -1, name: 1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Service.countDocuments(filter);
    
    return {
      services,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error('Error listing services:', error);
    throw new Error(`Failed to list services: ${error.message}`);
  }
}

/**
 * Get services by category
 */
export async function getServicesByCategory(categoryId: string, activeOnly = true) {
  try {
    await connectToDatabase();
    const filter: any = { categoryId };
    
    if (activeOnly) {
      filter.isActive = true;
    }
    
    const services = await Service.find(filter).sort({ popularityScore: -1, name: 1 });
    return services;
  } catch (error: any) {
    console.error('Error getting services by category:', error);
    throw new Error(`Failed to get services by category: ${error.message}`);
  }
}

/**
 * Update service popularity score
 */
export async function updateServicePopularity(serviceId: string, increment = 1) {
  try {
    await connectToDatabase();
    const service = await Service.findById(serviceId);
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    service.popularityScore += increment;
    await service.save();
    return service;
  } catch (error: any) {
    console.error('Error updating service popularity:', error);
    throw new Error(`Failed to update service popularity: ${error.message}`);
  }
} 