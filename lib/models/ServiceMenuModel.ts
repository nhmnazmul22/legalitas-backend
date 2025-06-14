// Import Mongoose
import mongoose, { Document, Model, Schema } from "mongoose";

// Types
export interface ServiceItem extends Document {
  title: string;
  link: string;
}

export interface ServiceItemWithBanner extends Document {
  menuName: string;
  link: string;
  bannerImg: string;
}

export interface ServiceCategory extends Document {
  title: string;
  children: ServiceItem[];
}

export interface ServiceCategoryWithBanner extends Document {
  title: string;
  children: ServiceItemWithBanner[];
}

export interface MenuServices extends Document {
  services: ServiceCategory[];
  servicesWithBanner: ServiceCategoryWithBanner;
}

// Schemas
const ServiceCategorySchema: Schema<ServiceCategory> = new mongoose.Schema({
  title: { type: String, required: true },
  children: {
    type: [
      {
        title: { type: String, required: true },
        link: { type: String, require: true },
      },
    ],
    required: true,
  },
});

const ServiceCategoryWithBannerSchema: Schema<ServiceCategoryWithBanner> =
  new mongoose.Schema({
    title: { type: String, required: true },
    children: {
      type: [
        {
          menuName: { type: String, required: true },
          link: { type: String, require: true },
          bannerImg: { type: String, require: true },
        },
      ],
      required: true,
    },
  });

const DataSchema: Schema<MenuServices> = new mongoose.Schema(
  {
    services: { type: [ServiceCategorySchema], required: true },
    servicesWithBanner: {
      type: ServiceCategoryWithBannerSchema,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const MenuServicesModel: Model<MenuServices> =
  mongoose.models.menuservices ||
  mongoose.model<MenuServices>("menuservices", DataSchema);

export default MenuServicesModel;

