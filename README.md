# qr.html

`qr.html` is a self contained website, that can generate QR codes via [qrcodejs](https://github.com/davidshimjs/qrcodejs).
Because it is fully self-contained, you can just download the file and open it on any computer that has a browser installed, no internet connection is needed.

You can use it to exchange data with your phone, exfiltrate data from a VM, or whatever else you use QR codes for.

## Known issues
- QR code size limitation: A maximum of 2950 characters can be used with error correction level L, less if you choose better error correction.
- Does not work with emojis (and probably any other special unicode things). TODO: give an option to base64 encode the text first.

## Common QR code payloads

Use case | Format | Example
---|---|---
Website | `<url>` | https://example.com/test/page?abc=def#title
Phone number | `tel:<phone>` | tel:+49-1234-567890
Send SMS | `smsto:<phone>:<message>` | smsto:+49-1234-567890:Hi there, this is a test SMS
Email (only address) | `mailto:<email>` | mailto:user@example.com
Email | `mailto:<email>?subject=<subject>&body=<body>` | mailto:email@example.com?subject=Test email subject&body=This is a test email
Wifi-Network (WPA2 Personal) | `WIFI:T:WPA;S:<name>;P:<password>;;` | WIFI:T:WPA;S:GuestWifi;P:Password123!;;

## License
- You can do whatever you want with my own code, since it is licensed under "The Unlicense".
- `qrcodejs` is licensed under the MIT License (see https://github.com/davidshimjs/qrcodejs)

