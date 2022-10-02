# qr.html

`qr.html` is a self contained website, that can generate QR codes via [qr-creator](https://github.com/nimiq/qr-creator).
Because it is fully self-contained, you can just download the file and open it on any computer that has a browser installed, no internet connection is needed.

You can use it to exchange data with your phone, exfiltrate data from a VM, or whatever else you use QR codes for.

## tiny-qr.html

If you have no direct channel to your target system (say you have a Citrix with no internet and clipboard & file upload disabled), you can use `tiny-qr.html`.
It is a very basic QR code generator optimized for size, so that you can transfer it faster using keystroke emulation software (like `xdotool type`):

1. Opening a text editor on the target
2. (Optional) Trying different typing speeds to find the fastest speed at which the transfered contents are not corrupted
3. Tell the keystroke emulation software to type the contents of `tiny-qr.html` and wait for it to finish.
4. Save the editor's contents as a `.html` file
5. Open the file with a browser of your choice

`tiny-qr.html` differs from `qr.html` in the follwoing ways:

- Very short error messages and use of popups instead of an dedicated error message field. No debugging data logged to the console
- No additional features such as drag and drop, clipboard watching, etc
- Simplified layout
- Use of short (mostly 1 letter) variable names, removed all comments
- When alternative syntaxes for something exist, using the shortest one
- The file is only approximately half as long (12916 characters vs 24863 characters at the time of writing)

## Known issues
- QR code size limitation: A maximum of 2950 characters can be used with error correction level L, less if you choose better error correction.
- When opening `qr.html` using a file URL in chromium and enabling the clipboard monitoring, a permissions dialog is triggered every time the clipboard is read (every second).

## Additional features

For convenience I have implemented some additional features, that make it easier / faster to generate QR codes from the data you want.
However, these features use APIs that not all browsers support.
My tests were conducted on a Mac and/or Linux computer, Windows support may differ:

Feature | Chrome | Firefox | Safari
---|---|---|---
Watch clipboard | Partial[^1] | With insecure workaround | No
Paste file | Yes | No | Yes
Drag and drop file | Yes | No | Yes

[^1]: It works with the online version or with locally hosted versions (via `python3 -m http.server`). But it does not work with `file://` URLs, because it does not remember the decision and thus creates a popup every time

### Watch clipboard

The idea is to watch the clipboard constantly (as far as allowed by the browser).

Use case: Allow using guest clipboard on host (via [a script that parses QR code and puts its content's in the clipboard](https://gitlab.com/six-two/wm-config/-/blob/main/bin/copy-qr-code)), when working with a VM, Citrix, or similar system where clipboard sharing may not work/be enabled.

Limits: Browsers only allow clipboard access when the specific tab and window are focused, browser support is terrible (probably since this is easy to abuse if the permission handling is not well implemented).

### Paste file

Copy a file from your OS file explorer and paste it into your browser to generate a QR code for the file's contents.

## Common QR code payloads

Use case | Format | Example
---|---|---
Website | `<url>` | https://example.com/test/page?abc=def#title
Phone number | `tel:<phone>` | tel:+49-1234-567890
Send SMS | `smsto:<phone>:<message>` | smsto:+49-1234-567890:Hi there, this is a test SMS
Email (only address) | `mailto:<email>` | mailto:user@example.com
Email | `mailto:<email>?subject=<subject>&body=<body>` | mailto:email@example.com?subject=Test email subject&body=This is a test email
Wifi-Network (WPA2 Personal) | `WIFI:T:WPA;S:<name>;P:<password>;;` | WIFI:T:WPA;S:GuestWifi;P:Password123!;;

## Changelog

- Added clipboard monitoring support. When the user enables the checkbox, the QR code is updated every time the clipboard changes. This feature can be completely disabled by modifying `qr.html` and setting `SHOW_CLIPBOARD_MONITORING_CONTROLS` to `false`.
- Changed QR code generator library from [qrcodejs](https://github.com/davidshimjs/qrcodejs) to [qr-creator](https://github.com/nimiq/qr-creator), beacuse qrcodejs is no longer maintained and buggy (had problems with Unicode). Even the better maintained fork (https://github.com/zhiyuan-l/qrcodejs) still had the same problem sometimes


## License
- You can do whatever you want with my own code, since it is licensed under "The Unlicense".
- `qr-creator` is licensed under the MIT License (see https://github.com/nimiq/qr-creator)

