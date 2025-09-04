# Búsqueda de Números Primos y Palabras  

## 1. Problema
En JavaScript, el código de la página web se ejecuta en un **único hilo**.  
Cuando se hacen operaciones grandes, la interfaz se congela y deja de responder hasta terminar el cálculo.

## 2. Solución
En este proyecto se plantea resolver este problema usando **Web Workers** (Criba de Eratóstenes y Búsqueda Binaria).  
Cada tarea pesada (cálculo de primos, búsqueda de palabra) se ejecuta en su propio hilo, de forma simultánea, manteniendo la interfaz **fluida y funcional**.
### Web Workers
Permiten ejecutar código JavaScript en **hilos separados** al del UI.  
Cada worker corre en paralelo, enviando y recibiendo mensajes del hilo principal.
En este proyecto:
- Un Worker calcula los primos.
- Otro Worker busca la palabra.
- El hilo principal solo recibe resultados y actualiza la UI.
### Criba
Es un algoritmo para encontrar **números primos** hasta un límite `n`.  
Funciona marcando en un array los múltiplos de cada número y eliminándolos como “no primos”.  
### Búsqueda Binaria
Es un algoritmo para encontrar un elemento dentro de un **array ordenado**.  
Divide el array a la mitad en cada paso.  
Reduce el tiempo de búsqueda de `O(n)` a `O(log n)`.

## 3. Explicación del código
1. **Separación de tareas pesadas**  
   Se crean dos Workers:
   - `workerPrimos`: ejecuta la Criba de Eratóstenes.
   - `workerBusquedaBinaria`: ejecuta la búsqueda binaria en el párrafo.

2. **Comunicación por mensajes**  
   El hilo principal (`app.js`) envía los datos (límite, párrafo, palabra) a cada worker usando `postMessage()` y recibe los resultados con `onmessage`.

3. **Interfaz no bloqueada**  
   La página mantiene su capacidad de interactuar mientras los Workers calculan, demostrando **programación concurrente**.
