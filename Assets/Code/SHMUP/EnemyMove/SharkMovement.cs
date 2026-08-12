using UnityEngine;

public class SharkMovement : EnemyMovement
{
    [Header("Shark Movement Settings")]
    [SerializeField] private Transform target;
    [SerializeField] private float smoothTime = 0.3f;
    private float velocityY;

    private void Awake()
    {
        if (target == null)
        {
            target = GameObject.FindGameObjectWithTag("Player").transform;
        }
    }

    protected override void Move()
    {
        float newY = Mathf.SmoothDamp(transform.position.y, target.position.y, ref velocityY, smoothTime, speed);

        transform.position = new Vector3(transform.position.x, newY, transform.position.z);
    }
}