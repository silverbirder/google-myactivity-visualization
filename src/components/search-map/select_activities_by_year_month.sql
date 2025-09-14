SELECT
    time,
    title,
    locationInfos,
    UNNEST(json_extract(products, '$')::VARCHAR[]) AS product
FROM
    activities
WHERE
    strftime ('%Y', CAST(time AS TIMESTAMP)) = '__YEAR__'
    AND strftime ('%m', CAST(time AS TIMESTAMP)) = '__MONTH__'
    AND locationInfos IS NOT NULL
    AND locationInfos != '[]'
    AND locationInfos LIKE '%url%'
    AND ('__PRODUCT__' = '' OR EXISTS (
        SELECT 1
        FROM UNNEST(json_extract(products, '$')::VARCHAR[]) AS t(product)
        WHERE t.product = '__PRODUCT__'
    ));
