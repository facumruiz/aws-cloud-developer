# 00b - Usuario IAM para despliegues (dev-terraform)

Guía para crear un usuario IAM dedicado a Terraform/CLI, en vez de usar la cuenta root para el trabajo del día a día. Hacer esto antes de desplegar cualquier proyecto en la cuenta real de AWS.

## Por qué no usar la cuenta root

La cuenta root tiene control total sobre todo, incluida la facturación y el cierre de la cuenta. Usarla para tareas operativas (como que Terraform despliegue recursos) es mala práctica de seguridad — si esas credenciales se filtran, el daño posible es máximo. Un usuario IAM aparte, con permisos acotados, limita el riesgo.

## Paso 1: Crear el usuario IAM

1. Consola de AWS → **IAM**
2. Menú izquierdo → **Usuarios de IAM** → **Crear usuario**
3. Nombre de usuario: `dev-terraform`
4. **NO** marcar "Proporcionar acceso a la consola de administración de AWS" (este usuario es solo para CLI/Terraform, no para loguearse en la consola web)
5. Siguiente
6. En "Establecer permisos" → **Adjuntar políticas directamente**
7. Buscar y marcar: **AdministratorAccess**
   > Nota: en un trabajo real se usarían permisos acotados a lo mínimo necesario (principio de menor privilegio). Acá se usa Administrator para evitar fricción mientras se aprende — es una decisión consciente, no un descuido.
8. Siguiente → **Crear persona**

## Paso 2: Generar el access key

1. Click en el usuario `dev-terraform` recién creado
2. Pestaña **Credenciales de seguridad**
3. Sección **Claves de acceso** → **Crear clave de acceso**
4. Caso de uso: **Interfaz de línea de comandos (CLI)**
5. Marcar la casilla de confirmación → Siguiente → **Crear clave de acceso**
6. **Descargar el .csv** con el Access Key ID y el Secret Access Key — se muestran una sola vez, no se pueden recuperar después

## Paso 3: Configurar el AWS CLI local

```bash
aws configure
```

Pide 4 datos:
- **AWS Access Key ID**: del .csv descargado
- **AWS Secret Access Key**: del .csv descargado
- **Default region name**: `us-east-1`
- **Default output format**: `json`

## Paso 4: Verificar que quedó bien configurado

```bash
aws sts get-caller-identity
```

Debería devolver un JSON con el `Account` de la cuenta real y el `Arn` apuntando al usuario `dev-terraform`. Si aparece esto, ya se está usando la cuenta real de AWS desde la terminal (no LocalStack).

## Resultado

A partir de acá, cualquier comando de `terraform` o `aws` corrido en la terminal usa estas credenciales del usuario `dev-terraform`, no la cuenta root.
