#!/bin/bash
mkdir -p mandastrong_studio_pages
cd mandastrong_studio_pages
cp ../background.mp4 .
cp ../avatar.mp4 .
echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>MandaStrong Studios</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>MandaStrong Studios</h1>
<div class='oval-video'><video id='avatar' width='200' height='200' onclick='this.paused ? this.play() : this.pause();'><source src='avatar.mp4' type='video/mp4'></video></div><p>Welcome to MandaStrong Studios</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page2.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page1.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Start Building Your Movie</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Start Building Your Movie</h1>
<p>Get ready to bring your story to life\!</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page1.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page3.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page2.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Login / Register</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Login / Register</h1>
<form><input type='text' placeholder='Username'><br><br><input type='password' placeholder='Password'><br><br><button>Login</button><button>Register</button></form><div><div class='neon-box'>$10 Basic Plan</div><div class='neon-box'>$20 Pro Plan</div><div class='neon-box'>$30 Studio Plan</div></div>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page2.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page4.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page3.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Tool Board 1</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Tool Board 1</h1>
<div class='neon-box'>Text-to-Speech</div><div class='neon-box'>Image Generator</div><div class='neon-box'>Video Animator</div><div class='neon-box'>Lip Sync</div>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page3.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page5.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page4.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Tool Board 2</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Tool Board 2</h1>
<div class='neon-box'>Voice Cloner</div><div class='neon-box'>Background Remover</div><div class='neon-box'>Script Writer</div><div class='neon-box'>AI Editor</div>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page4.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page6.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page5.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Tool Board 3</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Tool Board 3</h1>
<div class='neon-box'>Sound Mixer</div><div class='neon-box'>Scene Generator</div><div class='neon-box'>Caption Maker</div><div class='neon-box'>Character Creator</div>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page5.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page7.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page6.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Tool Board 4</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Tool Board 4</h1>
<div class='neon-box'>3-D Animator</div><div class='neon-box'>Camera Motion</div><div class='neon-box'>Lighting FX</div><div class='neon-box'>Video Color Grader</div>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page6.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page8.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page7.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Tool Board 5</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Tool Board 5</h1>
<div class='neon-box'>Music Scorer</div><div class='neon-box'>Transition Builder</div><div class='neon-box'>Clip Joiner</div><div class='neon-box'>Noise Reducer</div>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page7.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page9.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page8.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Tool Board 6</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Tool Board 6</h1>
<div class='neon-box'>Lip-Sync AI</div><div class='neon-box'>Actor Voice Generator</div><div class='neon-box'>Subtitle Sync</div><div class='neon-box'>FX Enhancer</div>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page8.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page10.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page9.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Scene Builder – Part 1</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Scene Builder – Part 1</h1>
<p>Upload script, select background scene / audio</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page9.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page11.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page10.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Scene Builder – Part 2</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Scene Builder – Part 2</h1>
<p>Add dialogue, timing, camera movement</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page10.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page12.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page11.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Scene Builder – Part 3</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Scene Builder – Part 3</h1>
<p>Add lighting / effects / color grading</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page11.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page13.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page12.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Scene Builder – Part 4</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Scene Builder – Part 4</h1>
<p>Add motion and transitions</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page12.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page14.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page13.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Scene Builder – Part 5</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Scene Builder – Part 5</h1>
<p>Merge clips, sync audio</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page13.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page15.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page14.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Scene Builder – Part 6</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Scene Builder – Part 6</h1>
<p>Add music, normalize audio</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page14.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page16.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page15.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Render Settings</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Render Settings</h1>
<p>Select resolution and duration (up to 120 min)</p><select><option>720p</option><option>1080p</option><option>4K</option></select><br><br><input type='number' min='1' max='120' placeholder='Duration (min)'>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page15.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page17.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page16.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Preview Your Movie</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Preview Your Movie</h1>
<video controls width='600'><source src='your-movie.mp4' type='video/mp4'></video>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page16.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page18.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page17.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Edit or Rebuild</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Edit or Rebuild</h1>
<p>Would you like to go back and modify tools or scenes?</p><button>Edit Tools</button><button>Edit Scenes</button>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page17.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page19.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page18.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Finalize Movie</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Finalize Movie</h1>
<input type='text' placeholder='Movie Title'><br><br><textarea placeholder='Credits...'></textarea>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page18.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page20.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page19.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Upload & Save</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Upload & Save</h1>
<p>Your movie is uploading to your profile / cloud...</p><progress value='50' max='100'></progress>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page19.html' style='color: #39ff14; margin-right: 20px;'>← Back</a><a href='page21.html' style='color: #39ff14;'>Next →</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page20.html

echo "<!DOCTYPE html>
<html><head><meta charset='UTF-8'><title>Congratulations!</title>
<style>
body {margin:0;font-family:Arial,sans-serif;background-color:black;color:#39ff14;overflow-x:hidden;}
.center {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.oval-video {border-radius:50%;width:200px;height:200px;overflow:hidden;margin:0 auto;}
.neon-box {border:2px solid #39ff14;padding:20px;margin:10px;display:inline-block;background-color:black;}
button {background:#39ff14;color:black;padding:10px;margin:5px;}
</style></head>
<body>
<video autoplay loop muted playsinline style='position:fixed;right:0;bottom:0;min-width:100%;min-height:100%;z-index:-1;'>
<source src='background.mp4' type='video/mp4'></video>
<div class='center'>
<h1>Congratulations\!</h1>
<video controls width='600'><source src='final-doxy-placeholder.mp4' type='video/mp4'></video><p>Thank you for using MandaStrong Studios\!</p>
</div>
<div style='position:fixed;bottom:50px;width:100%;text-align:center;'><a href='page20.html' style='color: #39ff14; margin-right: 20px;'>← Back</a></div>
<footer style='position:fixed;bottom:0;width:100%;text-align:center;color:#39ff14;font-size:12px;padding:10px;background:black;'>
MandaStrong1 2025 ~ Author of Doxy The School Bully ~ Find Me On 
<a href='https://mandastrong1.etsy.com' style='color:#39ff14;'>MandaStrong1.Etsy.com</a>
</footer>
<script>
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => alert(btn.innerText + " clicked!"));
});
</script>
</body></html>" > page21.html
