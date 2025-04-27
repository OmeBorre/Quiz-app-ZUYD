<?php
// Stel headers in om CORS-problemen te voorkomen
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Controleer of het een POST-verzoek is
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ontvang de JSON-data
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);
    
    // Controleer of de JSON-data geldig is
    if ($data === null) {
        http_response_code(400);
        echo json_encode(["message" => "Ongeldige JSON-data"]);
        exit;
    }
    
    // Pad naar het JSON-bestand
    $file = "user-results.json";
    
    // Controleer of het bestand bestaat
    if (file_exists($file)) {
        // Lees het bestaande bestand
        $currentData = json_decode(file_get_contents($file), true);
        
        // Voeg het nieuwe resultaat toe
        $currentData["results"][] = $data;
        
        // Update statistieken
        $currentData["statistics"]["totalAttempts"]++;
        $currentData["statistics"]["averageScore"] = ($currentData["statistics"]["averageScore"] * ($currentData["statistics"]["totalAttempts"] - 1) + $data["totalScore"]) / $currentData["statistics"]["totalAttempts"];
        $currentData["statistics"]["highestScore"] = max($currentData["statistics"]["highestScore"], $data["totalScore"]);
        $currentData["statistics"]["lowestScore"] = min($currentData["statistics"]["lowestScore"], $data["totalScore"]);
        $currentData["statistics"]["averageTimeSpent"] = ($currentData["statistics"]["averageTimeSpent"] * ($currentData["statistics"]["totalAttempts"] - 1) + $data["timeSpent"]) / $currentData["statistics"]["totalAttempts"];
        
        // Schrijf de bijgewerkte data terug naar het bestand
        if (file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT))) {
            http_response_code(200);
            echo json_encode(["message" => "Resultaat succesvol opgeslagen"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Fout bij het opslaan van het resultaat"]);
        }
    } else {
        // Maak een nieuw bestand met het eerste resultaat
        $newData = [
            "results" => [$data],
            "statistics" => [
                "totalAttempts" => 1,
                "averageScore" => $data["totalScore"],
                "highestScore" => $data["totalScore"],
                "lowestScore" => $data["totalScore"],
                "averageTimeSpent" => $data["timeSpent"],
                "mostDifficultCategory" => "Geen data",
                "mostDifficultQuestion" => 0
            ]
        ];
        
        // Schrijf de nieuwe data naar het bestand
        if (file_put_contents($file, json_encode($newData, JSON_PRETTY_PRINT))) {
            http_response_code(201);
            echo json_encode(["message" => "Eerste resultaat succesvol opgeslagen"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Fout bij het opslaan van het eerste resultaat"]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Alleen POST-verzoeken zijn toegestaan"]);
}
?> 