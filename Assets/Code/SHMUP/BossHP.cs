using UnityEngine;

public class BossHP : MonoBehaviour, IDamageable
{
    [SerializeField] private float maxHP = 100f;
    [SerializeField] private BossHPBar hpBar;

    private float currentHP;

    private void Start()
    {
        currentHP = maxHP;

        // If the hpBar is not assigned, it'll try to find one in the scene, and if it still can't find one, it'll log a warning and continue without an hpBar
        if (hpBar == null)
        {
            try
            {
                hpBar = FindObjectOfType<BossHPBar>();
            }
            catch
            {
                Debug.LogWarning("BossHPBar not found in the scene.");
            }
        }
        if (hpBar != null)
        {
            hpBar.SetHealth(currentHP);
        }
    }

    // A method from the IDamageable interface that reduces the boss's health by the given damage amount
    public void TakeDamage(float damage)
    {
        currentHP -= damage;
        currentHP = Mathf.Clamp(currentHP, 0, maxHP);

        if (hpBar != null)
        {
            hpBar.SetHealth(currentHP);
        }

        if (currentHP <= 0)
        {
            GameManager.Instance.Victory();
        }
    }
}