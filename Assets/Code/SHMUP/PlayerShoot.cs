using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerShoot : MonoBehaviour
{
    [Header("Torpedo Settings")]
    [SerializeField] private GameObject torpedoPrefab;
    [SerializeField] private float torpedoLifetime;
    [SerializeField] private float damage;

    [Header("Shooting Settings")]
    [SerializeField] private float shootCooldown;
    [SerializeField] private float initialForce;

    [Header("References")]
    [SerializeField] private Transform attackSpawn;

    private float nextFireTime;

    private void Update()
    {
        nextFireTime += Time.deltaTime;
    }

    public void Shoot(InputAction.CallbackContext context)
    {
        if (!context.performed)
        {
            return;
        }

        if (nextFireTime <= shootCooldown)
        {
            return;
        }

        nextFireTime = 0;

        GameObject projectile = Instantiate(torpedoPrefab, attackSpawn.position, attackSpawn.rotation);

        
        PlayerTorpedo torpedo = projectile.AddComponent<PlayerTorpedo>();
        torpedo.Damage = damage;

        Destroy(projectile, torpedoLifetime);
    }
}