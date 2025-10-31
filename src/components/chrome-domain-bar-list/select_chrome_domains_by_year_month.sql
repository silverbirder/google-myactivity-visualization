SELECT
    CASE
        WHEN header = 'Chrome' THEN
            CASE
                        WHEN titleUrl LIKE 'https://www.google.com/search%' THEN 'google.com'
                        WHEN titleUrl LIKE 'https://www.google.com/url%' THEN
                            regexp_extract(
                                url_decode(
                                    regexp_extract(titleUrl, '[?&]q=([^&]+)', 1)
                                ),
                                '^(?:https?://)?([^/?]+)', 1
                            )
                        ELSE regexp_extract(titleUrl, '^(?:https?://)?([^/?]+)', 1)
            END
        ELSE header
    END AS domain,
    COUNT(*) AS count
FROM activities
WHERE (
    EXISTS (
        SELECT 1
        FROM UNNEST(json_extract(products, '$')::VARCHAR[]) AS t(product)
        WHERE product = 'Chrome'
    )
    OR header = 'Chrome'
)
    AND CAST(time AS DATE) BETWEEN '__FIRST_DAY__' AND '__LAST_DAY__'
    AND titleUrl IS NOT NULL
    AND (
        CASE
            WHEN header = 'Chrome' THEN
                CASE
                    WHEN titleUrl LIKE 'https://www.google.com/search%' THEN 'google.com'
                    WHEN titleUrl LIKE 'https://www.google.com/url%' THEN
                        regexp_extract(
                            url_decode(
                                regexp_extract(titleUrl, '[?&]q=([^&]+)', 1)
                            ),
                            '^(?:https?://)?([^/?]+)', 1
                        )
                    ELSE regexp_extract(titleUrl, '^(?:https?://)?([^/?]+)', 1)
                END
            ELSE header
        END
    ) != 'google.com'
GROUP BY domain
ORDER BY count DESC
LIMIT 100;
