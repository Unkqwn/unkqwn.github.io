using UnityEngine;

public class PiranhaMovement : EnemyMovement
{
    [Header("Piranha Movement Settings")]
    [SerializeField] private float minDirectionChangeTime = 0.2f;
    [SerializeField] private float maxDirectionChangeTime = 1.2f;

    private float currentDirection = 1f;
    private float directionTimer;

    protected override void Move()
    {
        directionTimer -= Time.deltaTime;

        if (directionTimer <= 0f)
        {
            PickNewDirection();
        }

        Vector3 viewportPos = mainCamera.WorldToViewportPoint(transform.position);

        if (viewportPos.y >= 1f - boundaryPadding)
        {
            currentDirection = -1f;
        }
        else if (viewportPos.y <= 0f + boundaryPadding)
        {
            currentDirection = 1f;
        }

        Vector3 pos = transform.position;
        pos.y += currentDirection * speed * Time.deltaTime;
        transform.position = pos;
    }

    private void PickNewDirection()
    {
        currentDirection = Random.value > 0.5f ? 1f : -1f;
        directionTimer = Random.Range(minDirectionChangeTime, maxDirectionChangeTime);
    }
}