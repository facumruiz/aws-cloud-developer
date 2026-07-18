# 06 - Configuración y variables de entorno

## Concepto

El código no debería tener hardcodeados nombres de tablas, URLs, claves, etc. Esos valores se inyectan desde afuera (variables de entorno), así el mismo código sirve en distintos ambientes (dev, staging, producción) sin tocar una línea.

## Por qué importa en la entrevista

Ya lo usaste sin darte cuenta en el Proyecto 2 (`process.env.TABLE_NAME` en las Lambdas, seteado desde Terraform). Acá entendés **por qué** se hace así, no solo cómo.

## Correr

```bash
node app.js
```

Después probá:
```bash
TABLE_NAME=tasks-dev node app.js
```

## Para practicar

- Agregá una segunda variable, `STAGE` (por ejemplo `dev` o `prod`), y hacé que el mensaje de log cambie según el valor
- Pensá: ¿por qué es buena idea que el código falle fuerte y claro (`throw`) si falta una variable obligatoria, en vez de seguir con un valor por defecto?

## Documentación oficial

- [Lambda: variables de entorno](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
