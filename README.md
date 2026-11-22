# Alumno

Luis Ruiz

# To-Do App List

Aplicación web para gestionar tareas diarias, creada con React, TypeScript y Tailwind CSS.

## Características Agregadas a la Demo - Parte 1

- Persistencia de datos con localstorage: Las tareas se guardan automáticamente en el almacenamiento local del navegador cada vez que se crea, edita, completa o elimina un elemento, evitando que la información se pierda al recargar o cerrar la página. Esto se logra mediante la modificación de la inicialización del estado task para que lea primero si hay datos guardados en localstorage, luego, se agrega un useEffect que ante cualquier cambio en el arreglo de tareas, lo convierte a JSON y lo guarda en localstorage

- Edición de tareas en línea: Permite modificar el texto de cualquier tarea existente haciendo doble clic sobre ella o presionando el botón de edición (`EDITAR`). Incluye soporte para confirmar cambios con la tecla `Enter` y cancelar con `Escape`. Para esto, se agregan los estados "editingId" (para saber que tarea se edita) y "editText" (para guardar el nuevo texto temporal), se crean las funciones startEdit, saveEdit y cancelEdit, luego se renderiza cada "li"

- Filtros por estado con contador: Incorpora pestañas interactivas para visualizar Todas, Pendientes o Completadas, mostrando en tiempo real la cantidad de tareas correspondientes a cada categoría. Se logra agregando un estado filter que tiene 3 valores, (all, pending, completed), se agregan sus respectivos botones y filteredTask filtra las tareas dependiendo de su estado y las ubica en listas derivadas.


## Tecnologías utilizadas

* [React](https://react.dev)
* [TypeScript](https://typescriptlang.org)
* [Vite](https://vite.dev)
* [Tailwind CSS](https://tailwindcss.com)

## Instalación y uso

1. Clona este repositorio o descarga el código.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
