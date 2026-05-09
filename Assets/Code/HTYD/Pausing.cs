using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.SceneManagement;

public class Pausing : MonoBehaviour
{
    [SerializeField] private GameObject pauseMenu;

    private GameManager gameManager;

    private void Start()
    {
        gameManager = GameManager.Instance;
    }

    private void Update()
    {
        // Pause or resume the game based on the isGamePaused variable in GameManager
        if (gameManager.isGamePaused)
        {
            Time.timeScale = 0f;
        }
        else
        {
            Time.timeScale = 1f;
        }
        pauseMenu.SetActive(gameManager.isGamePaused);
    }

    public void OnPause(InputAction.CallbackContext context)
    {
        if (context.performed)
        {
            gameManager.isGamePaused = !gameManager.isGamePaused;
        }
    }

    public void ResumeButton()
    {
        gameManager.isGamePaused = false;
    }

    public void RestartButton()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    public void QuitButton()
    {
        // Stops play mode in the editor and quits the application in a build
        Application.Quit();
#if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
#endif
    }
}
