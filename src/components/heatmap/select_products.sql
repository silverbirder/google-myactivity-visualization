SELECT DISTINCT product
FROM (
  SELECT UNNEST(json_extract(products, '$')::VARCHAR[]) AS product FROM activities
)
WHERE product IS NOT NULL AND product != ''
ORDER BY product;
