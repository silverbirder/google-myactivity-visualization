SELECT DISTINCT product
FROM (
  SELECT UNNEST(json_extract(products, '$')::VARCHAR[]) AS product FROM activities
  WHERE locationInfos IS NOT NULL 
    AND locationInfos != '[]'
    AND strftime ('%Y', CAST(time AS TIMESTAMP)) = '__YEAR__'
    AND strftime ('%m', CAST(time AS TIMESTAMP)) = '__MONTH__'
)
WHERE product IS NOT NULL AND product != ''
ORDER BY product;
