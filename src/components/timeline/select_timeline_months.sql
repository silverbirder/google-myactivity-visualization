SELECT
  CAST(strftime('%Y', CAST(time AS TIMESTAMP)) AS INTEGER) AS year,
  CAST(strftime('%m', CAST(time AS TIMESTAMP)) AS INTEGER) AS month
FROM activities
CROSS JOIN UNNEST(json_extract(products, '$')::VARCHAR[]) AS t(product)
WHERE product IS NOT NULL AND product != ''
GROUP BY year, month
ORDER BY year DESC, month DESC;
