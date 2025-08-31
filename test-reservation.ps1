$body = @{
    firstName = "John"
    lastName = "Smith"
    email = "john.smith@test.com"
    phone = "3095551234"
    fromCity = "Moline"
    to = "O'Hare"
    pickupAddress = "123 Main Street, Moline, IL 61265"
    dropoffAddress = "Terminal 1, O'Hare International Airport, Chicago, IL"
    direction = "oneway"
    date = "2025-09-01"
    time = "10:00"
    passengers = 1
    luggage = 0
    promo = ""
    notes = "Test reservation"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3008/api/reservations" -Method POST -Headers $headers -Body $body
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}
