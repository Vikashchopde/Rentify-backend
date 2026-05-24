import Listing from "../models/listing.js";
import cloudinary from "../config/cloudinary.js";

export const listingCreate = async (req, res) => {
  // console.log(req.body);
  try {
    const {
      title,
      description,
      city,
      area,
      address,
      price,
      amenities,
      category,
    } = req.body;

    // ✅ OWNER FROM BACKEND (JWT)
    const ownerId = req.user.id;

    if (!title || !city || !price || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ SAFE AMENITIES PARSE
    let parsedAmenities = [];
    try {
      parsedAmenities = amenities ? JSON.parse(amenities) : [];
    } catch {
      parsedAmenities = [];
    }

    // ✅ IMAGE UPLOAD
    let imageUrls = [];
    if (req.files && req.files.images) {
      for (const img of req.files.images) {
        const result = await cloudinary.uploader.upload(
          `data:${img.mimetype};base64,${img.buffer.toString("base64")}`,
          {
            folder: "rentify/images",
            quality: "auto:low",
            fetch_format: "auto",
          }
        );
        
        imageUrls.push(result.secure_url);
      }
    }

    // ✅ VIDEO UPLOAD
    let videoUrl = "";
    if (req.files && req.files.video) {
      try {
        const vid = req.files.video[0];
        const result = await cloudinary.uploader.upload(
          `data:${vid.mimetype};base64,${vid.buffer.toString("base64")}`,
          {
            folder: "rentify/videos",
            resource_type: "video",
          }
        );
        videoUrl = result.secure_url;
      } catch (err) {
        toast.error(
    err.response?.data?.error ||
    "Video upload failed"
  );
      }
    }

    // ✅ SAVE TO DB
    const newListing = await Listing.create({
      title,
      description,
      city,
      area,
      address,
      price,
      category,
      amenities: parsedAmenities,
      images: imageUrls,
      video: videoUrl,
      owner: ownerId,   // 🔒 secure
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing: newListing,
    });

  } catch (err) {
    console.error("LISTING CREATE ERROR:", err);
    res.status(500).json({ message: "Listing server error" });
  }
};

export const listingUpdate = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields
    const { title, description, city, area, address, price, amenities } =
      req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (city) listing.city = city;
    if (area) listing.area = area;
    if (address) listing.address = address;
    if (price) listing.price = price;
    if (amenities) listing.amenities = JSON.parse(amenities);

    // -------------------------
    // If new images uploaded
    // -------------------------
    if (req.files.images) {
      let newImages = [];

      for (const img of req.files.images) {
        const result = await cloudinary.uploader.upload(
          `data:${img.mimetype};base64,${img.buffer.toString("base64")}`,
          { folder: "rentify/images" }
        );
        newImages.push(result.secure_url);
      }

      listing.images = newImages; // replace old images
    }

    // -------------------------
    // If new video uploaded
    // -------------------------
    if (req.files.video) {
      const vid = req.files.video[0];

      const result = await cloudinary.uploader.upload(
        `data:${vid.mimetype};base64,${vid.buffer.toString("base64")}`,
        {
          folder: "rentify/videos",
          resource_type: "video",
        }
      );

      listing.video = result.secure_url; // replace old video
    }

    await listing.save();

    res.json({
      message: "Listing updated successfully",
      listing,
    });
  } catch (err) {
    res.status(500).json({ message: "Listing updated Server error" });
  }
};

export const listingDelete = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check owner
    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: " listing delete Server error" });
  }
};

export const listingFilter = async (req, res) => {
  try {
    const { city, area, minPrice, maxPrice, owner, limit, category } =
      req.query;

    const filters = {};

    // City filter (case insensitive)
    if (city) {
      filters.city = { $regex: city, $options: "i" };
    }

    // Area filter
    if (area) {
      filters.area = { $regex: area, $options: "i" };
    }

    // Category filter ⭐ FIXED
    if (category && category !== "") {
      filters.category = category;
    }

    // Owner filter
    if (owner) {
      filters.owner = owner;
    }

    // Price filters
    if (minPrice) {
      filters.price = { ...(filters.price || {}), $gte: Number(minPrice) };
    }

    if (maxPrice) {
      filters.price = { ...(filters.price || {}), $lte: Number(maxPrice) };
    }

    // DB query
    const listings = await Listing.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit ? Number(limit) : 0);

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: " listing filter Server error" });
  }
};

export const listingsingle = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner", "name email phone avatar")
      .populate("reviews.user", "name"); // ⭐ IMPORTANT

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const viewerId = req.query.viewer; // viewer jo listing dekh rha hain

    // ⭐ Increase views only if viewer is NOT owner
    if (viewerId && viewerId !== listing.owner.toString()) {
      listing.views = listing.views + 1;
      await listing.save();
    }

    // Find related listings (same location but exclude same listing)
    const relatedListings = await Listing.find({
      city: listing.city,
      _id: { $ne: listing._id },
    }).limit(6);

    res.json({ listing, relatedListings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const OwnerListing = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch owner listings" });
  }
};
