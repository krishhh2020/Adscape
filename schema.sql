CREATE TABLE advertisers (
  advertiser_id SERIAL PRIMARY KEY,
  company_name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE admins (
  admin_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  role VARCHAR(50)
);

CREATE TABLE ad_assets (
  asset_id SERIAL PRIMARY KEY,
  file_url TEXT,
  type VARCHAR(20)
);

CREATE TABLE billboards (
  billboard_id SERIAL PRIMARY KEY,
  location VARCHAR(100),
  price_per_day NUMERIC,
  resolution VARCHAR(50)
);

CREATE TABLE campaigns (
  campaign_id SERIAL PRIMARY KEY,
  status VARCHAR(20),
  start_date DATE,
  end_date DATE,
  reviewed_by_admin_id INT REFERENCES admins(admin_id),
  rejection_reason TEXT,
  asset_id INT REFERENCES ad_assets(asset_id),
  advertiser_id INT REFERENCES advertisers(advertiser_id)
);

CREATE TABLE payments (
  payment_id SERIAL PRIMARY KEY,
  amount NUMERIC,
  transaction_date DATE,
  campaign_id INT REFERENCES campaigns(campaign_id)
);

CREATE TABLE campaign_billboard_link (
  campaign_id INT REFERENCES campaigns(campaign_id),
  billboard_id INT REFERENCES billboards(billboard_id),
  PRIMARY KEY (campaign_id, billboard_id)
);
