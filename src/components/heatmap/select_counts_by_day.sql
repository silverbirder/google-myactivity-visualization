SELECT
  CAST(strftime(CAST(time AS TIMESTAMP), '%d') AS INTEGER) AS day,
  COUNT(*) AS count
FROM activities
WHERE EXISTS (
  SELECT 1
  FROM UNNEST(json_extract(products, '$')::VARCHAR[]) AS t(product)
  WHERE product = '__PRODUCT__'
)
AND CAST(time AS DATE) BETWEEN '__FIRST_DAY__' AND '__LAST_DAY__'
GROUP BY day
ORDER BY day;
