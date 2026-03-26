using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerAim : MonoBehaviour
{
    [SerializeField] private float rotateSpeed = 10f;
    [SerializeField] private LayerMask aimLayerMask;

    private Vector2 joystickLook, mouseLook;

    public bool isPaused;

    public void OnMouseLook(InputAction.CallbackContext context)
    {
        mouseLook = context.ReadValue<Vector2>();
    }

    public void OnJoystickLook(InputAction.CallbackContext context)
    {
        joystickLook = context.ReadValue<Vector2>();
    }

    private void Update()
    {
        if (joystickLook.sqrMagnitude > 0.01f)
        {
            AimAt(new Vector3(joystickLook.x, 0f, joystickLook.y));
        }
        else
        {
            Vector2 mousePos = Mouse.current.position.ReadValue();
            Ray ray = Camera.main.ScreenPointToRay(mousePos);

            if (Physics.Raycast(ray, out RaycastHit hit, 100f, aimLayerMask))
            {
                AimAt(hit.point - transform.position);
            }
        }
    }

    private void AimAt(Vector3 dir)
    {
        dir.y = 0f;

        if (dir.sqrMagnitude < 0.01f)
        {
            return;
        }

        Quaternion targetRot = Quaternion.LookRotation(dir);

        transform.rotation = Quaternion.Slerp(transform.rotation, targetRot, rotateSpeed * Time.deltaTime);
    }
}