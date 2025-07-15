import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Product.model.js";

dotenv.config();

const sampleProducts = [
    {
        name: "Aurora Nightstand",
        description: "Elegant nightstand with two drawers and a walnut finish.",
        price: 120000,
        category: "Bedroom",
        stock: 20,
        brand: "Furniro",
        tags: ["Nightstand", "Bedroom", "Wood"],
        ratings: 4.1,
        numReviews: 2.9,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
        ]
    },
    {
        name: "Vesta Coffee Table",
        description: "Modern glass coffee table with gold metal legs.",
        price: 300000,
        category: "Living",
        stock: 18,
        brand: "Furniro",
        tags: ["Table", "Living", "Glass"],
        ratings: 4.6,
        numReviews: 3.7,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308"
        ]
    },
    {
        name: "Nimbus Bookshelf",
        description: "Tall bookshelf with five spacious shelves for storage.",
        price: 450000,
        category: "Living",
        stock: 10,
        brand: "Furniro",
        tags: ["Bookshelf", "Living", "Storage"],
        ratings: 4.4,
        numReviews: 3.5,
        sizes: ["Tall", "Short"],
        images: [
            "https://plus.unsplash.com/premium_photo-1684338795288-097525d127f0"
        ]
    },
    {
        name: "Orion Dining Set",
        description: "Six-seater dining set with oak wood finish.",
        price: 1200000,
        category: "Dining",
        stock: 7,
        brand: "Furniro",
        tags: ["Dining", "Set", "Wood"],
        ratings: 4.9,
        numReviews: 4.8,
        sizes: ["6-Seater", "4-Seater"],
        images: [
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            "https://images.unsplash.com/photo-1460518451285-97b6aa326961"
        ]
    },
    {
        name: "Celeste Armchair",
        description: "Comfortable armchair with velvet upholstery.",
        price: 350000,
        category: "Living",
        stock: 14,
        brand: "Furniro",
        tags: ["Armchair", "Living", "Velvet"],
        ratings: 4.2,
        numReviews: 3.6,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
            "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg"
        ]
    },
    {
        name: "Atlas Wardrobe",
        description: "Spacious wardrobe with sliding doors and mirror.",
        price: 900000,
        category: "Bedroom",
        stock: 6,
        brand: "Furniro",
        tags: ["Wardrobe", "Bedroom", "Storage"],
        ratings: 4.5,
        numReviews: 4.0,
        sizes: ["Large", "Medium"],
        images: [
            "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
            "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
            "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"
        ]
    },
    {
        name: "Echo TV Stand",
        description: "Minimalist TV stand with cable management system.",
        price: 280000,
        category: "Living",
        stock: 11,
        brand: "Furniro",
        tags: ["TV Stand", "Living", "Minimalist"],
        ratings: 4.0,
        numReviews: 3.2,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca"
        ]
    },
    {
        name: "Nova Recliner",
        description: "Recliner chair with adjustable back and footrest.",
        price: 600000,
        category: "Living",
        stock: 9,
        brand: "Furniro",
        tags: ["Recliner", "Living", "Comfort"],
        ratings: 4.7,
        numReviews: 4.3,
        sizes: ["Standard"],
        images: [

            "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
        ]
    },
    {
        name: "Luna Bedside Lamp",
        description: "Bedside lamp with adjustable brightness and modern design.",
        price: 80000,
        category: "Bedroom",
        stock: 25,
        brand: "Furniro",
        tags: ["Lamp", "Bedroom", "Lighting"],
        ratings: 4.3,
        numReviews: 3.7,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308"

        ]
    },
    {
        name: "Bliss Rug",
        description: "Soft area rug for living room or bedroom.",
        price: 95000,
        category: "Living",
        stock: 30,
        brand: "Furniro",
        tags: ["Rug", "Living", "Bedroom"],
        ratings: 4.6,
        numReviews: 4.1,
        sizes: ["Large", "Medium", "Small"],
        images: [

            "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
        ]
    },
    {
        name: "Mira Dresser",
        description: "Six-drawer dresser with a sleek white finish.",
        price: 400000,
        category: "Bedroom",
        stock: 8,
        brand: "Furniro",
        tags: ["Dresser", "Bedroom", "Storage"],
        ratings: 4.4,
        numReviews: 3.9,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1631679706909-1844bbd07221",
            "https://images.unsplash.com/photo-1460518451285-97b6aa326961",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
        ]
    },
    {
        name: "Pavo Floor Lamp",
        description: "Tall floor lamp with a brass finish and fabric shade.",
        price: 150000,
        category: "Living",
        stock: 13,
        brand: "Furniro",
        tags: ["Lamp", "Living", "Lighting"],
        ratings: 4.2,
        numReviews: 3.8,
        sizes: ["Standard"],
        images: [
            "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
            "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg"
        ]
    },
    {
        name: "Solis Dining Chair",
        description: "Set of two upholstered dining chairs with wooden legs.",
        price: 220000,
        category: "Dining",
        stock: 16,
        brand: "Furniro",
        tags: ["Chair", "Dining", "Upholstered"],
        ratings: 4.5,
        numReviews: 4.0,
        sizes: ["Standard"],
        images: [
            "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"

        ]
    },
    {
        name: "Terra Plant Stand",
        description: "Wooden plant stand for indoor plants.",
        price: 60000,
        category: "Living",
        stock: 22,
        brand: "Furniro",
        tags: ["Plant Stand", "Living", "Wood"],
        ratings: 4.1,
        numReviews: 3.5,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
        ]
    },
    {
        name: "Vivid Wall Art",
        description: "Colorful abstract wall art for modern interiors.",
        price: 180000,
        category: "Living",
        stock: 17,
        brand: "Furniro",
        tags: ["Wall Art", "Living", "Decor"],
        ratings: 4.7,
        numReviews: 4.4,
        sizes: ["Large", "Medium"],
        images: [
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca"

        ]
    },
    {
        name: "Opal Mirror",
        description: "Round wall mirror with a gold frame.",
        price: 110000,
        category: "Bedroom",
        stock: 19,
        brand: "Furniro",
        tags: ["Mirror", "Bedroom", "Decor"],
        ratings: 4.3,
        numReviews: 3.8,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc"

        ]
    },
    {
        name: "Cleo Ottoman",
        description: "Multi-purpose ottoman with storage space inside.",
        price: 175000,
        category: "Living",
        stock: 21,
        brand: "Furniro",
        tags: ["Ottoman", "Living", "Storage"],
        ratings: 4.6,
        numReviews: 4.2,
        sizes: ["Standard"],
        images: [
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            "https://images.unsplash.com/photo-1460518451285-97b6aa326961"
        ]
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Furniro",
        });
        console.log("MongoDB Connected Successfully");

        // Clear existing products
        await Product.deleteMany({});
        console.log("Cleared existing products");

        // Insert sample products
        const insertedProducts = await Product.insertMany(sampleProducts);
        console.log(`Successfully inserted ${insertedProducts.length} products`);

        // Display the products with their IDs
        insertedProducts.forEach(product => {
            console.log(`Product: ${product.name} - ID: ${product._id}`);
        });

        mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
};

seedProducts(); 