SELECT 
  year,
  product,
  COUNT(*) as count
FROM (
  SELECT 
    CAST(strftime('%Y', time::TIMESTAMP) AS INTEGER) AS year,
    UNNEST(json_extract(products, '$')::VARCHAR[]) AS product
  FROM activities
  WHERE products IS NOT NULL
)
WHERE product IS NOT NULL AND product != ''
GROUP BY year, product
ORDER BY year DESC, product ASC;