using UnityEngine;

public class KrakenMovement : EnemyMovement
{
    private float verticalDirection = 1f;

    protected override void Move()
    {
        Vector3 pos = transform.position;

        pos.y += verticalDirection * speed * Time.deltaTime;
        transform.position = pos;

        Vector3 viewportPos = mainCamera.WorldToViewportPoint(transform.position);

        if (viewportPos.y >= 1f - boundaryPadding)
        {
            verticalDirection = -1f;
        }
        else if (viewportPos.y <= 0f + boundaryPadding)
        {
            verticalDirection = 1f;
        }
    }
}
