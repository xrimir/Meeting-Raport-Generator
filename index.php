<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aplikacja do zebrań</title>
    <link rel="stylesheet" media="screen" href="./static/style.css">
    <link rel="shortcut icon" href="./static/images/favicon.png" type="image/x-icon">
    <script src="./js/pdfmake.min.js"></script>
    <script src="https://kit.fontawesome.com/5c509d133a.js" crossorigin="anonymous"></script>
</head>

<body>
    <!-- Lista działów w tablicy php. W oparciu ,którą są wyświelnane elementy -->
    <?php $divisions = array("Sprawy OgÓlne", "SPA", "Basen", "Animacje", "Ochrona", "Gastronomia", "Recepcja", "Marketing", "SiŁownia", "Szkolenia", "DziaŁ IT"); ?>

    <main>
        <header class="main-heading">
            <h2 id="meeting">Zebranie z: <span id="data"><?php echo date("Y.m.d"); ?></span></h2>
        </header>
        <!-- Iteracja tablicy -> tworzenie sekcji w oparciu o nią -->
        <?php
        foreach ($divisions as $division) {
            echo '<fieldset class="container-fluid sections">
            <legend data-division="'. mb_strtolower($division, 'UTF-8').'">' . strToUpper($division) . '</legend>';
            echo '<div class="form-row">
                <div class="textInput">
                    <textarea class="resize-control textareaInput" data-border="" cols="3" rows="5"  onkeydown="expandingTextarea(this)" maxlength="1400"></textarea><div class="micContainer" onClick="micListen(this)"><img class="mic" src="./static/images/mic.png"/></i></div>
                </div>
                <div class="options">
                <p class="infoFor" >Informacja dla: </p>
                <div class="select">
                    <select class="workers">
                     <option value=""disabled selected hidden>Wybierz... </option>
                     <option class="options">Osoba 1</option>
                     <option class="options">Osoba 2</option>
                     <option class="options">Osoba 3</option>
                    </select>
                <div class="select_arrow">
                </div>
                </div>
                </div>
            </div><button class="addBtn" onclick="addText(this)"><span class="plusSign">+</span> Dodaj</button></fieldset>';
        }
        ?>
    </main>
    <div class="moduleWrapper"><form id="formSaveFile"><i class="fas fa-save"></i> <input type="text" id="fileSaveName" value=<?php echo "Zebranie_".date("Y.m.d")."_".date("H.i.s") ?>><input type="submit" id="saveFileSubmit" value="Zapisz"></form></div>
    <div class="moduleWrapper"><form id="formImportFile"><i class="fas fa-file-import"></i> <input type="file" id="fileImportInput" accept="application/json"></form></div>

    <div class="pdfBtnWrapper moduleWrapper"><button id="pdfConvert">Konwertuj do pdf</button></div>
    <div id="jumpSectionsContent">
            <ul id="jumpSections">
				<?php foreach ($divisions as $division) { 
					echo "<li>".mb_strtoupper($division, 'UTF-8')."</li>";
				}
				?>
            </ul>
        </div>
    <div id="jumpSectionsBtn"><i class="fas fa-arrow-up arrow"></i>
    </div>
    <script src="./js/app.js"></script>
    <script src="./js/vfs_fonts_georgia.js"></script>
    <script src="./js/convertToPdf.js"></script>
</body>
</html>
