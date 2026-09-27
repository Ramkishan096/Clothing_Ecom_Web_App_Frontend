/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable-next-line no-unused-vars
import { UPLOADS_URL } from "../../../../../../config";
import DeletImageOnlyFromCloudnery from "../../../../../../ImageUpload/DeletImageOnlyFromCloudnery";
import FileUploadProduct from "../../../../../../ImageUpload/FileUploadProduct";
import styles from "./ProductForm.module.css";
import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPlus, FaTag, FaBox, FaImage, FaCube, FaTshirt } from "react-icons/fa";

const ProductForm = ({ product = null, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    gender: "",
    price: "",
    discount: "",
    coverImage: "",
    images: [],
    package_weight_in_kg: "",
    package_dimension: {
      length: "",
      breadth: "",
      height: "",
    },
    sizes: [{ size: "M", stock: "" }],
    material: "",
    fit: "",
    tags: [],
    isNewArrival: false,
    isPopular: false,
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const errorRefs = useRef({});
  const sectionRefs = useRef({});

  const categories = ["T-Shirts", "Shirts", "Pants", "Jeans", "Jackets", "Sweaters"];
  const subCategories = ["Casual", "Formal", "Sports", "Party", "Western", "Traditional"];
  const genders = ["Men", "Women", "Boys", "Girls", "Unisex"];
  const fits = ["Regular", "Slim", "Oversized", "Relaxed", "Skinny"];
  const sizeOptions = ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        brand: product.brand || "",
        gender: product.gender || "",
        price: product.price || "",
        discount: product.discount || "",
        coverImage: product.coverImage || "",
        images: product.images || [],
        package_weight_in_kg: product.package_weight_in_kg || "",
        package_dimension: {
          length: product.package_dimension?.length || "",
          breadth: product.package_dimension?.breadth || "",
          height: product.package_dimension?.height || "",
        },
        sizes: product.sizes || [{ size: "M", stock: ""}],
        material: product.material || "",
        fit: product.fit || "",
        tags: product.tags || [],
        isNewArrival: product.isNewArrival || false,
        isPopular: product.isPopular || false,
        isFeatured: product.isFeatured || false,
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    let firstErrorField = null;

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
      if (!firstErrorField) firstErrorField = "name";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      if (!firstErrorField) firstErrorField = "name";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      if (!firstErrorField) firstErrorField = "description";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
      if (!firstErrorField) firstErrorField = "description";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
      if (!firstErrorField) firstErrorField = "category";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
      if (!firstErrorField) firstErrorField = "brand";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      if (!firstErrorField) firstErrorField = "gender";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
      if (!firstErrorField) firstErrorField = "price";
    } else if (isNaN(formData.price)) {
      newErrors.price = "Price must be a number";
      if (!firstErrorField) firstErrorField = "price";
    }

    if (formData.discount) {
      const discountNum = parseFloat(formData.discount);
      if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
        newErrors.discount = "Discount must be between 0 and 100";
        if (!firstErrorField) firstErrorField = "discount";
      }
    }

    if (formData.sizes.some((s) => s.stock < 0)) {
      newErrors.sizes = "Stock cannot be negative";
      if (!firstErrorField) firstErrorField = "sizes";
    }

    if (!formData.coverImage.trim()) {
      newErrors.coverImage = "Cover image is required";
      if (!firstErrorField) firstErrorField = "coverImage";
    }

    if (!formData.package_weight_in_kg || parseFloat(formData.package_weight_in_kg) <= 0) {
      newErrors.package_weight_in_kg = "Package weight is required";
      if (!firstErrorField) firstErrorField = "package_weight_in_kg";
    }

    const dim = formData.package_dimension;
    if (!dim.length || parseFloat(dim.length) <= 0) {
      newErrors.package_dimension_length = "Length is required";
      if (!firstErrorField) firstErrorField = "package_dimension_length";
    }
    if (!dim.breadth || parseFloat(dim.breadth) <= 0) {
      newErrors.package_dimension_breadth = "Breadth is required";
      if (!firstErrorField) firstErrorField = "package_dimension_breadth";
    }
    if (!dim.height || parseFloat(dim.height) <= 0) {
      newErrors.package_dimension_height = "Height is required";
      if (!firstErrorField) firstErrorField = "package_dimension_height";
    }

    setErrors(newErrors);

    // Scroll to first error
    if (firstErrorField && errorRefs.current[firstErrorField]) {
      setTimeout(() => {
        errorRefs.current[firstErrorField]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        errorRefs.current[firstErrorField]?.focus();
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    if (field === "stock") {
      newSizes[index].stock = parseInt(value) || 0;
    } else {
      newSizes[index].size = value;
    }
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => {
    if (formData.sizes.length < 6) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { size: "", stock: "" }],
      });
    }
  };

  const removeSize = (index) => {
    if (formData.sizes.length > 1) {
      const newSizes = formData.sizes.filter((_, i) => i !== index);
      setFormData({ ...formData, sizes: newSizes });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim().toLowerCase()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleImageUploadSuccess = (filename) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, filename],
    }));
  };

  const handleCoverImageUploadSuccess = (filename) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: filename,
    }));
  };

  const removeImage = async (index) => {
    const imageToRemove = formData.images[index];
    if (imageToRemove && imageToRemove.includes("/")) {
      const publicId = imageToRemove.split("/").pop().split(".")[0];
      await DeletImageOnlyFromCloudnery(publicId);
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeCoverImage = async () => {
    const coverImage = formData.coverImage;
    if (coverImage && coverImage.includes("/")) {
      const publicId = coverImage.split("/").pop().split(".")[0];
      await DeletImageOnlyFromCloudnery(publicId);
    }
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        sizes: formData.sizes.map((s) => ({
          ...s,
          stock: parseInt(s.stock) || 0,
        })),
        stockQuantity: formData.sizes.reduce(
          (sum, s) => sum + parseInt(s.stock || 0),
          0,
        ),
        inStock: formData.sizes.some((s) => parseInt(s.stock) > 0),
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <h2>{product ? "✏️ Edit Product" : "✨ Add New Product"}</h2>
            <span className={styles.headerBadge}>
              {product ? "Update" : "Create"}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Section 1: Basic Information */}
            <div className={`${styles.section} ${styles.sectionBasic}`} ref={(el) => sectionRefs.current.basic = el}>
              <div className={styles.sectionHeader}>
                <FaTshirt className={styles.sectionIcon} />
                <h3>Basic Information</h3>
                <span className={styles.requiredBadge}>Required</span>
              </div>

              <div className={styles.formGroup}>
                <label>
                  Product Name <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  ref={(el) => errorRefs.current.name = el}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name..."
                  className={errors.name ? styles.error : ""}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>
                  Description <span className={styles.requiredStar}>*</span>
                </label>
                <textarea
                  ref={(el) => errorRefs.current.description = el}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your product in detail..."
                  className={errors.description ? styles.error : ""}
                />
                {errors.description && <span className={styles.errorText}>{errors.description}</span>}
              </div>
            </div>

            {/* Section 2: Category & Brand */}
            <div className={`${styles.section} ${styles.sectionCategory}`} ref={(el) => sectionRefs.current.category = el}>
              <div className={styles.sectionHeader}>
                <FaBox className={styles.sectionIcon} />
                <h3>Category & Brand</h3>
                <span className={styles.requiredBadge}>Required</span>
              </div>

              <div className={styles.formGroup}>
                <label>
                  Category <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  ref={(el) => errorRefs.current.category = el}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? styles.error : ""}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className={styles.errorText}>{errors.category}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Sub Category</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>
                  Brand <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  ref={(el) => errorRefs.current.brand = el}
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name..."
                  className={errors.brand ? styles.error : ""}
                />
                {errors.brand && <span className={styles.errorText}>{errors.brand}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>
                  Gender <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  ref={(el) => errorRefs.current.gender = el}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={errors.gender ? styles.error : ""}
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
              </div>
            </div>

            {/* Section 3: Pricing */}
            <div className={`${styles.section} ${styles.sectionPricing}`} ref={(el) => sectionRefs.current.pricing = el}>
              <div className={styles.sectionHeader}>
                <FaCube className={styles.sectionIcon} />
                <h3>Pricing Details</h3>
                <span className={styles.requiredBadge}>Required</span>
              </div>

              <div className={styles.formGroup}>
                <label>
                  MRP Price (₹) <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  ref={(el) => errorRefs.current.price = el}
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={errors.price ? styles.error : ""}
                />
                {errors.price && <span className={styles.errorText}>{errors.price}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Discount (%)</label>
                <input
                  ref={(el) => errorRefs.current.discount = el}
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="0-100"
                  min="0"
                  max="100"
                  className={errors.discount ? styles.error : ""}
                />
                {errors.discount && <span className={styles.errorText}>{errors.discount}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Final Price</label>
                <input
                  type="text"
                  value={
                    formData.price && formData.discount
                      ? `₹${(formData.price - (formData.price * formData.discount) / 100).toFixed(2)}`
                      : formData.price ? `₹${formData.price}` : "₹0.00"
                  }
                  disabled
                  className={styles.readonly}
                />
              </div>
            </div>

            {/* Section 4: Package Details */}
            <div className={`${styles.section} ${styles.sectionPackage}`} ref={(el) => sectionRefs.current.package = el}>
              <div className={styles.sectionHeader}>
                <FaBox className={styles.sectionIcon} />
                <h3>Package Details</h3>
                <span className={styles.requiredBadge}>Required</span>
              </div>

              <div className={styles.formGroup}>
                <label>
                  Weight (kg) <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  ref={(el) => errorRefs.current.package_weight_in_kg = el}
                  type="number"
                  name="package_weight_in_kg"
                  value={formData.package_weight_in_kg}
                  onChange={handleChange}
                  placeholder="e.g., 0.5"
                  step="0.01"
                  min="0"
                  className={errors.package_weight_in_kg ? styles.error : ""}
                />
                {errors.package_weight_in_kg && <span className={styles.errorText}>{errors.package_weight_in_kg}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>
                  Dimensions (cm) <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.dimensionRow}>
                  <div className={styles.dimensionInputWrapper}>
                    <input
                      ref={(el) => errorRefs.current.package_dimension_length = el}
                      type="number"
                      value={formData.package_dimension.length}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          package_dimension: {
                            ...formData.package_dimension,
                            length: e.target.value,
                          },
                        });
                        if (errors.package_dimension_length) {
                          setErrors({ ...errors, package_dimension_length: "" });
                        }
                      }}
                      placeholder="Length"
                      step="0.1"
                      min="0"
                      className={errors.package_dimension_length ? styles.error : ""}
                    />
                    {errors.package_dimension_length && <span className={styles.errorText}>{errors.package_dimension_length}</span>}
                  </div>
                  <div className={styles.dimensionInputWrapper}>
                    <input
                      ref={(el) => errorRefs.current.package_dimension_breadth = el}
                      type="number"
                      value={formData.package_dimension.breadth}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          package_dimension: {
                            ...formData.package_dimension,
                            breadth: e.target.value,
                          },
                        });
                        if (errors.package_dimension_breadth) {
                          setErrors({ ...errors, package_dimension_breadth: "" });
                        }
                      }}
                      placeholder="Breadth"
                      step="0.1"
                      min="0"
                      className={errors.package_dimension_breadth ? styles.error : ""}
                    />
                    {errors.package_dimension_breadth && <span className={styles.errorText}>{errors.package_dimension_breadth}</span>}
                  </div>
                  <div className={styles.dimensionInputWrapper}>
                    <input
                      ref={(el) => errorRefs.current.package_dimension_height = el}
                      type="number"
                      value={formData.package_dimension.height}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          package_dimension: {
                            ...formData.package_dimension,
                            height: e.target.value,
                          },
                        });
                        if (errors.package_dimension_height) {
                          setErrors({ ...errors, package_dimension_height: "" });
                        }
                      }}
                      placeholder="Height"
                      step="0.1"
                      min="0"
                      className={errors.package_dimension_height ? styles.error : ""}
                    />
                    {errors.package_dimension_height && <span className={styles.errorText}>{errors.package_dimension_height}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Images */}
            <div className={`${styles.section} ${styles.sectionImages}`} ref={(el) => sectionRefs.current.images = el}>
              <div className={styles.sectionHeader}>
                <FaImage className={styles.sectionIcon} />
                <h3>Product Images</h3>
                <span className={styles.requiredBadge}>Required</span>
              </div>

              <div className={styles.formGroup}>
                <label>
                  Cover Image <span className={styles.requiredStar}>*</span>
                </label>
                {formData.coverImage && (
                  <div className={styles.imagePreview}>
                    <img src={`${UPLOADS_URL}${formData.coverImage}`} alt="Cover" />
                    <button type="button" onClick={removeCoverImage} className={styles.removeImageBtn}>
                      <FaTimes />
                    </button>
                  </div>
                )}
                <FileUploadProduct
                  name="coverImage"
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, coverImage: e.target.value }));
                  }}
                  onUploadSuccess={handleCoverImageUploadSuccess}
                  folderName="cover-images"
                  accept=".jpg,.jpeg,.png,.webp"
                />
                {errors.coverImage && <span className={styles.errorText}>{errors.coverImage}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Additional Images</label>
                <div className={styles.imageList}>
                  {formData.images.map((img, index) => (
                    <div key={index} className={styles.imageItem}>
                      <img src={`${UPLOADS_URL}/${img}`} alt={`Product ${index}`} />
                      <button type="button" onClick={() => removeImage(index)} className={styles.removeImageBtn}>
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                <FileUploadProduct
                  name="additionalImage"
                  onUploadSuccess={handleImageUploadSuccess}
                  folderName="product-images"
                  accept=".jpg,.jpeg,.png,.webp"
                />
              </div>
            </div>

            {/* Section 6: Sizes & Stock */}
            <div className={`${styles.section} ${styles.sectionSizes}`} ref={(el) => sectionRefs.current.sizes = el}>
              <div className={styles.sectionHeader}>
                <FaTshirt className={styles.sectionIcon} />
                <h3>Sizes & Stock</h3>
                <span className={styles.requiredBadge}>Required</span>
              </div>

              {formData.sizes.map((sizeObj, index) => (
                <div key={index} className={styles.sizeRow}>
                  <select
                    value={sizeObj.size}
                    onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                  >
                    <option value="">Select Size</option>
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={sizeObj.stock}
                    onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                    placeholder="Stock"
                    // min="0"
                  />
                  {formData.sizes.length > 1 && (
                    <button type="button" onClick={() => removeSize(index)} className={styles.removeSizeBtn}>
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              {errors.sizes && <span className={styles.errorText}>{errors.sizes}</span>}
              <button type="button" className={styles.addBtn} onClick={addSize}>
                <FaPlus /> Add Size
              </button>
            </div>

            {/* Section 7: Additional Details */}
            <div className={`${styles.section} ${styles.sectionAdditional}`} ref={(el) => sectionRefs.current.additional = el}>
              <div className={styles.sectionHeader}>
                <FaBox className={styles.sectionIcon} />
                <h3>Additional Details</h3>
              </div>

              <div className={styles.formGroup}>
                <label>Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="e.g., 100% Cotton"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Fit</label>
                <select name="fit" value={formData.fit} onChange={handleChange}>
                  <option value="">Select Fit</option>
                  {fits.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Tags</label>
                <div className={styles.tagInputGroup}>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tag and press Enter"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag}>
                    <FaPlus /> Add
                  </button>
                </div>
                <div className={styles.tags}>
                  {formData.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      <FaTag />
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 8: Product Flags */}
            <div className={`${styles.section} ${styles.sectionFlags}`} ref={(el) => sectionRefs.current.flags = el}>
              <div className={styles.sectionHeader}>
                <FaBox className={styles.sectionIcon} />
                <h3>Product Flags</h3>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleChange}
                  />
                  <span className={styles.checkboxText}>✨ New Arrival</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                  />
                  <span className={styles.checkboxText}>🔥 Popular</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  <span className={styles.checkboxText}>⭐ Featured</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.loadingSpinner}>⏳</span>
              ) : product ? (
                "🔄 Update Product"
              ) : (
                "➕ Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;