# PRODUCT REQUIREMENT DOCUMENT (PRD)
# PROJECT: Sri Garments
# VERSION: v1.0
# ARCHITECTURE: Production Ready
# FRONTEND: Next.js
# BACKEND: Supabase
# HOSTING: Vercel

==================================================
1. PROJECT OVERVIEW
==================================================

Project Name:
Sri Garments

Project Type:
Garments Ecommerce + CRM + Inventory Management Platform

Primary Goal:
Generate leads, increase business growth, manage inventory, customers, products, and internal operations through a centralized system.

Problem Statement:
Current garment operations lack centralized digital management for inventory, product showcasing, customer handling, and business growth tracking.

Target Users:
- Retail Customers
- Dealers
- Wholesalers
- Internal Staff
- Organization Owners

Platform Scope:
- Ecommerce Website
- CRM Dashboard
- Inventory Management
- Role-Based Admin System
- Analytics Dashboard

==================================================
2. TECH STACK
==================================================

Frontend:
- Next.js 15
- TypeScript
- Tailwind CSS
- ShadCN UI

Backend:
- Supabase

Supabase Services:
- Supabase Auth
- PostgreSQL Database
- Supabase Storage
- Supabase Realtime
- Edge Functions

Hosting:
- Vercel

Realtime:
- Live inventory updates
- Order notifications
- Dashboard live metrics

Authentication:
- Email/Password Authentication

Architecture Type:
- Single Tenant
- Organization Ownership Model

==================================================
3. USER ROLE STRUCTURE
==================================================

ROLES:
1. Super Admin
2. Owner
3. Inventory Manager
4. Staff

ROLE HIERARCHY:
Super Admin
   ↓
Owner
   ↓
Inventory Manager
   ↓
Staff

ROLE DEFINITIONS:

Super Admin:
- Full platform access
- User management
- Permission management
- Analytics access
- System configuration

Owner:
- Business management
- Sales monitoring
- Product approvals
- Customer management

Inventory Manager:
- Product uploads
- Stock management
- Barcode handling
- Inventory monitoring

Staff:
- Limited dashboard access
- Product viewing
- Order assistance

==================================================
4. AUTHENTICATION & SECURITY
==================================================

Authentication Features:
- Email/password login
- Secure session management
- Organization-level authentication
- Custom RBAC session logic

Security Level:
HIGH

Security Requirements:
- Row Level Security (RLS)
- JWT validation
- Protected API routes
- Middleware route protection
- Session timeout handling
- Activity audit logs
- Role-based route access

==================================================
5. CORE MODULES
==================================================

MODULE 1 — WEBSITE FRONTEND

Features:
- Responsive homepage
- Hero banners
- Featured products
- Trending products
- Product categories
- Search system
- Product filters
- Product detail pages
- Wishlist system
- Review & rating system
- Offer banners
- Mobile-first UI

Pages:
- Home
- Shop
- Product Details
- Categories
- Wishlist
- Login
- Register
- About
- Contact

==================================================

MODULE 2 — PRODUCT MANAGEMENT

Features:
- Product creation
- Product editing
- Product deletion
- Product publishing
- Variant management
- Inventory linking
- Barcode/QR support

PRODUCT FIELDS:

Basic Fields:
- Product ID
- SKU
- Product Name
- Slug
- Description
- Short Description

Category Fields:
- Main Category
- Subcategory
- Tags

Variant Fields:
- Size
- Color
- Fabric
- Custom Variants

Pricing Fields:
- Base Price
- Discount Price
- Offer Status

Inventory Fields:
- Stock Quantity
- Available Quantity
- Reserved Quantity
- Barcode Number
- QR Code

Media Fields:
- Product Images
- Thumbnail Image

Status Fields:
- Active
- Draft
- Out of Stock
- Archived

SEO Fields:
- Meta Title
- Meta Description
- SEO Slug

==================================================

MODULE 3 — INVENTORY MANAGEMENT

Features:
- Stock tracking
- Inventory updates
- Low stock alerts
- Barcode inventory handling
- Realtime stock sync

Inventory Functions:
- Stock In
- Stock Out
- Manual Adjustments
- Variant stock management

Realtime Features:
- Live stock updates
- Dashboard inventory sync

==================================================

MODULE 4 — CUSTOMER MANAGEMENT (CRM)

Features:
- Customer database
- Customer profiles
- Purchase history
- Wishlist tracking
- Customer activity logs

Customer Fields:
- Customer ID
- Name
- Email
- Mobile Number
- Address
- City
- State
- Pincode
- Customer Type
- Last Purchase Date

CRM Features:
- Customer search
- Customer filters
- Customer notes
- Customer segmentation

==================================================

MODULE 5 — ANALYTICS DASHBOARD

Features:
- Revenue analytics
- Product performance
- Customer analytics
- Sales metrics

Dashboard Widgets:
- Total Revenue
- Total Orders
- Active Customers
- Top Selling Products
- Low Stock Products
- Monthly Sales Chart

Realtime Metrics:
- Live sales count
- Active users
- Inventory movement

==================================================

MODULE 6 — OFFER & COUPON SYSTEM

Features:
- Coupon creation
- Discount campaigns
- Percentage discounts
- Fixed amount discounts
- Expiry management

Coupon Fields:
- Coupon Code
- Discount Type
- Discount Value
- Expiry Date
- Usage Limit
- Active Status

==================================================

MODULE 7 — REVIEW & RATING SYSTEM

Features:
- Product reviews
- Product ratings
- Review moderation
- Star ratings

Review Fields:
- Rating
- Review Message
- Review Status
- Customer Reference

==================================================

MODULE 8 — WHATSAPP INTEGRATION

Features:
- WhatsApp lead button
- Inquiry messaging
- Product share via WhatsApp

Use Cases:
- Customer inquiry
- Product sharing
- Lead conversion

==================================================
6. ADMIN PANEL ARCHITECTURE
==================================================

Admin Layout:
- Sidebar Navigation
- Top Navigation
- Hybrid Dashboard Layout

Dashboard Sections:
- Overview
- Products
- Inventory
- Customers
- Analytics
- Coupons
- Reviews
- Users
- Settings

==================================================
7. NEXT.JS APPLICATION STRUCTURE
==================================================

APP ROUTES:

Public Routes:
/
 /shop
 /product/[slug]
 /categories
 /login
 /register
 /about
 /contact

Protected Routes:
/dashboard
/dashboard/products
/dashboard/inventory
/dashboard/customers
/dashboard/analytics
/dashboard/users
/dashboard/settings

==================================================
8. DATABASE ARCHITECTURE
==================================================

MAIN TABLES:

1. users
2. roles
3. permissions
4. user_roles
5. products
6. product_variants
7. product_images
8. categories
9. inventory
10. customers
11. customer_addresses
12. wishlists
13. reviews
14. coupons
15. analytics_events
16. activity_logs
17. audit_logs

==================================================
9. DATABASE RELATIONSHIPS
==================================================

products
→ belongs to categories

product_variants
→ belongs to products

product_images
→ belongs to products

inventory
→ belongs to product_variants

reviews
→ belongs to products
→ belongs to customers

wishlists
→ belongs to customers
→ belongs to products

activity_logs
→ belongs to users

==================================================
10. SUPABASE ARCHITECTURE
==================================================

SUPABASE AUTH:
- Email/password login
- Session handling
- Protected routes

SUPABASE DATABASE:
- PostgreSQL relational schema
- Foreign key constraints
- Indexed queries

SUPABASE STORAGE:
Buckets:
- product-images
- thumbnails

SUPABASE REALTIME:
- Inventory updates
- Notifications
- Dashboard metrics

SUPABASE EDGE FUNCTIONS:
- Barcode generation
- WhatsApp trigger handling
- Analytics aggregation

==================================================
11. ROW LEVEL SECURITY (RLS)
==================================================

RLS RULES:

Super Admin:
- Full access

Owner:
- Full business data access

Inventory Manager:
- Product + inventory access only

Staff:
- Restricted read access

==================================================
12. API STRATEGY
==================================================

API PATTERN:
- Server Actions
- Supabase RPC
- Edge Functions

Core APIs:
- Product CRUD
- Inventory updates
- Customer management
- Analytics fetching
- Coupon management

==================================================
13. FILE STORAGE STRATEGY
==================================================

Allowed Uploads:
- Product images

Validation Rules:
- JPG/PNG/WebP only
- Max upload size validation
- Compression optimization

==================================================
14. REALTIME SYSTEMS
==================================================

Realtime Features:
- Live inventory updates
- Live dashboard metrics
- Instant order alerts
- Activity updates

==================================================
15. AUDIT LOGGING SYSTEM
==================================================

Track:
- User login history
- Product modifications
- Inventory changes
- Permission updates
- Dashboard activity

Audit Fields:
- Action Type
- Timestamp
- User ID
- Previous Value
- Updated Value

==================================================
16. ANALYTICS REQUIREMENTS
==================================================

Analytics Metrics:
- Total Revenue
- Product Views
- Customer Growth
- Conversion Rate
- Best Sellers
- Inventory Movement

==================================================
17. PERFORMANCE REQUIREMENTS
==================================================

Performance Targets:
- Initial page load < 3 seconds
- Dashboard load < 2 seconds
- API response < 500ms
- Mobile optimized

==================================================
18. MOBILE RESPONSIVENESS
==================================================

Device Support:
- Mobile
- Tablet
- Desktop

Priority:
- Mobile-first design

==================================================
19. NON-FUNCTIONAL REQUIREMENTS
==================================================

Security:
- RLS enabled
- Secure authentication
- Session validation

Scalability:
- Modular architecture
- Expandable database design

Availability:
- 99.9% uptime target

Backup:
- Daily database backups

Observability:
- Error logging
- Activity monitoring

==================================================
20. DEPLOYMENT ARCHITECTURE
==================================================

ENVIRONMENTS:

Production:
- Vercel deployment
- Supabase production instance

Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

==================================================
21. FEATURE REQUIREMENTS
==================================================

FR-001:
System shall allow admins to upload products.

FR-002:
System shall support product variants.

FR-003:
System shall manage realtime inventory.

FR-004:
System shall provide customer CRM management.

FR-005:
System shall provide analytics dashboard.

FR-006:
System shall support wishlist functionality.

FR-007:
System shall support review & rating system.

FR-008:
System shall support coupon management.

FR-009:
System shall provide WhatsApp integration.

FR-010:
System shall maintain audit logs.

==================================================
22. EDGE CASE HANDLING
==================================================

Edge Cases:
- Duplicate SKU prevention
- Invalid inventory values
- Unauthorized role access
- Image upload failure
- Concurrent stock updates
- Deleted category references

==================================================
23. RISKS
==================================================

Technical Risks:
- Inventory sync conflicts
- Realtime scaling

Business Risks:
- Incorrect stock counts
- Unauthorized admin access

Deployment Risks:
- Environment variable misconfiguration

==================================================
24. SUCCESS METRICS
==================================================

Business KPIs:
- Lead growth
- Conversion increase
- Customer retention

System KPIs:
- Faster inventory handling
- Reduced stock mismatch
- Improved admin efficiency

==================================================
25. FUTURE EXPANSION READINESS
==================================================

Future Ready Modules:
- Payment gateway integration
- GST invoice system
- Multi-language support
- Shipping integration
- Multi-warehouse support
- COD support
- Refund management
- AI product recommendations

==================================================
26. FINAL DELIVERY EXPECTATIONS
==================================================

Expected Deliverables:
- Production-ready Next.js application
- Supabase backend architecture
- Admin CRM dashboard
- Ecommerce frontend
- Realtime inventory system
- Mobile responsive UI
- Role-based access system

END OF PRD