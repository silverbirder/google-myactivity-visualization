SELECT
  strftime('%H', CAST(time AS TIMESTAMP)) as hour,
  product,
  COUNT(*) as count
FROM activities
CROSS JOIN UNNEST(json_extract(products, '$')::VARCHAR[]) AS t(product)
WHERE strftime('%Y', CAST(time AS TIMESTAMP)) = __YEAR__
  AND strftime('%m', CAST(time AS TIMESTAMP)) = __MONTH__
  AND strftime('%w', CAST(time AS TIMESTAMP)) IN (__WEEKDAYS__)
  AND product IS NOT NULL AND product != ''
GROUP BY hour, product
ORDER BY hour ASC, count DESC;
