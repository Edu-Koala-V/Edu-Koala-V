<?php
namespace Plugins\Minify;
use MatthiasMullie\Minify;

class minifyJS
{
    const _inputJSPath_ = "./Components/JS/";
    const _outputJSPath_ = "./app/JS/";
    /**
     * Ta metoda służy do minifikacji plików JS i łączenia podanych nazw plików z katalogu Components w jeden plik
     * wynikowy o podanej nazwie w katalogu app.
     * Należy pamietac, o poprawności kolejności wymaganych plików i niepowtarzalności stosowanych w nich nazw funkcji i zmiennych.
     * Katalog Components jest katalogiem developerskim
     * Katalog app jest katalogiem produkcyjnym
     * @param array $filesJS - tablica z nazwami plików JS z katalogu Components
     * @param string $outputFile - nazwa pliku wynikowego w katalogu app
     */
    public static function minifyJS(array $filesJS, string $outputFile,$isAddGlobal = true)
    {
        
        if($outputFile == "globalApp" && $isAddGlobal){
            $minifier = new Minify\JS();
            self::setupShortNames();
            // Najpierw dodaj plik StaticNames.js
            $minifier->add(__DIR__."/Config/StaticNames.js");
            $minifier->minify(__DIR__."/Config/StaticNames.js");
        }
        
        $minifier = new Minify\JS();
    
        foreach ($filesJS as $file) {
            $minifier->add(self::_inputJSPath_.$file.".js");
        }
    
        $minifier->minify(self::_outputJSPath_.$outputFile.".js");
        self::replaceNamesInMinifyFile(self::_outputJSPath_.$outputFile.".js");

        if($outputFile !== "globalApp" && $isAddGlobal){
            self::scaleFiles("./app/JS/globalApp.js", self::_outputJSPath_.$outputFile.".js",";");
        }else if($isAddGlobal){
            self::scaleFiles(__DIR__."/Config/StaticNames.js", self::_outputJSPath_.$outputFile.".js",";");

        }
    
    
        
    }
    /**
     * Ta metoda służy do minifikacji plików CSS i łączenia podanych nazw plików z katalogu Components w jeden plik
     * wynikowy o podanej nazwie w katalogu app.
     * Należy pamietac, o poprawności kolejności wymaganych plików i niepowtarzalności stosowanych w nich nazw funkcji i zmiennych.
     * Katalog Components jest katalogiem developerskim
     * Katalog app jest katalogiem produkcyjnym
     * @param array $filesCSS - tablica z nazwami plików CSS z katalogu Components
     * @param string $outputFile - nazwa pliku wynikowego w katalogu app
     */
    public static function minifyCSS(array $filesCSS, string $outputFile, array $globalFiles ,$isAddGlobal = true)
    {
        $minifier = new Minify\CSS();
        foreach ($globalFiles as $file) {
            $minifier->add("./Components/CSS/".$file.".css");
        }
        $minifier->minify('./app/CSS/globalApp.css');
        $minifier = new Minify\CSS();
        foreach ($filesCSS as $file) {
            $minifier->add("./Components/CSS/".$file.".css");
        }
        $minifier->minify('./app/CSS/'.$outputFile.".css");
        if($outputFile !== "globalApp" && $isAddGlobal){
            self::scaleFiles("./app/CSS/globalApp.css", "./app/CSS/".$outputFile.".css");
        }
    }

  private static function scaleFiles($file1, $file2, $separator = " "){
    
        $file1Content = file_get_contents($file1);
        $file2Content = file_get_contents($file2);
        
        $combinedContent = $file1Content.$separator . $file2Content;
        
        file_put_contents($file2, $combinedContent);
    
    }
    
   
    private static function setupShortNames(){
        $configData = file_get_contents(__DIR__."/Config/JSNameReplace.json");
        $config = json_decode($configData, true);
    
        $jsConst = fopen(__DIR__."/Config/StaticNames.js", "w");
    
        foreach ($config as $item) {
            fwrite($jsConst, 'const ' . $item['short_name'] . ' = ' . $item['bind'] . ";\n");
        }
    
        fclose($jsConst);
    }
    
    private static function replaceNamesInMinifyFile($minifyFilieJS){
        $configData = file_get_contents(__DIR__."/Config/JSNameReplace.json");
        $config = json_decode($configData, true);
    
        $minifyFileContent = file_get_contents($minifyFilieJS);
    
        foreach ($config as $item) {
            $minifyFileContent = str_replace($item['full_name'], $item['short_name'], $minifyFileContent);
        }
    
        file_put_contents($minifyFilieJS, $minifyFileContent);
    }
    
    
}