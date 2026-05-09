using UnityEngine;

public class BossHP : MonoBehaviour, IDamageable
{
    [SerializeField] private float maxHP = 100f;
    [SerializeField] private BossHPBar hpBar;

    private float currentHP;

    private void Start()
    {
        currentHP = maxHP;

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