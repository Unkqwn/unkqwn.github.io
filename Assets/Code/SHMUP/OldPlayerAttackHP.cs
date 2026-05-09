using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerAttackHP : MonoBehaviour
{
    [SerializeField] private Transform attackSpawn;
    [SerializeField] private GameObject torpedoPrefab;
    [SerializeField] public float playerHealth;
    public bool isDead;
    [SerializeField] playerhealth _healthbar;
    void Update()
    {
        //So your able to shoot
        if (Input.GetButtonDown("Fire1"))
        {
            Shoot();
        }
        if (playerHealth <= 0)
        {
            Lose();
            Destroy(gameObject);
        }
    }
    private void Shoot()
    {
        //The attack spawn
        GameObject torpedo = Instantiate(torpedoPrefab, attackSpawn.position, attackSpawn.rotation);
        torpedo.layer = gameObject.layer;
    }

    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("EnemyBullet"))
        {
            playerHealth--;
            _healthbar.SetHealth(playerHealth);
            
        }
       
    }
    public void Lose()
    {
            SceneManager.LoadScene("EndScreen");
    }
}
