using UnityEngine;

public abstract class EnemyMovement : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] protected float speed;
    [SerializeField] protected float boundaryPadding = 0.1f;
    [SerializeField] protected float collisionDamage = 20f;

    protected Camera mainCamera;

    private EnemyHP enemyDeath;

    private void Start()
    {
        mainCamera = Camera.main;
        enemyDeath = GetComponent<EnemyHP>();
    }

    private void Update()
    {
        Move();

        ClampEnemy();

        if (transform.position.x < mainCamera.transform.position.x - mainCamera.orthographicSize * mainCamera.aspect + boundaryPadding)
        {
            Destroy(gameObject);
        }
    }

    protected abstract void Move();

    private void ClampEnemy()
    {
        Vector3 pos = transform.position;
        Vector3 viewportPos = mainCamera.WorldToViewportPoint(pos);
        viewportPos.y = Mathf.Clamp(viewportPos.y, boundaryPadding, 1f - boundaryPadding);
        transform.position = mainCamera.ViewportToWorldPoint(viewportPos);
    }

    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Enemy"))
        {
            enemyDeath.Die();
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        PlayerHP playerHP = other.GetComponent<PlayerHP>();
        if (other.CompareTag("Player"))
        {
            playerHP.TakeDamage(collisionDamage);
            enemyDeath.Die();
        }
    }
}
