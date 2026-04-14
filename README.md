<!DOCTYPE html>
 <head>
   <h1>mi certificado CISCO</h1>
 </head>
<body> 
[HTML_Essentials_certificate_andresfercos-gmail-com_6a0498b7-5575-45e4-a9b6-03a62271ff5a.pdf](https://github.com/user-attachments/files/26695658/HTML_Essentials_certificate_andresfercos-gmail-com_6a0498b7-5575-45e4-a9b6-03a62271ff5a.pdf)
<br>
<br>
# proyecto-cosmeSolucion-Dev
Documentación de mi proceso de aprendizaje en desarrollo web a través del curso de Cisco. Contiene soluciones a retos de algoritmos, lógica de programación y proyectos propios desarrollados en JavaScript

  <script>
    const getLocationButton = document.getElementById('getLocation');
    const resultElement = document.getElementById('result');
    
    getLocationButton.addEventListener('click', () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resultElement.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        });
      } else {
        resultElement.textContent = "Geolocation is not supported by your browser.";
      }
    });
  </script>
</body>
<br>
<footer>
 andres fernando cosme
 <br>
 
 <strong>3157605670</strong><strong>
</footer>
