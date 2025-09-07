SELECT
  strftime('%H', CAST(time AS TIMESTAMP)) as hour,
  product,
  COUNT(*) as count
FROM activities
CROSS JOIN UNNEST(json_extract(products, '$')::VARCHAR[]) AS t(product)
WHERE strftime('%Y', CAST(time AS TIMESTAMP)) = ?
  AND strftime('%m', CAST(time AS TIMESTAMP)) = ?
  AND product IS NOT NULL AND product != ''
GROUP BY hour, product
ORDER BY hour ASC, count DESC;
