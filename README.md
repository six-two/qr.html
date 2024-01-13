# qr.html

`qr.html` is a self contained website, that can generate QR codes via [qr-creator](https://github.com/nimiq/qr-creator).
Because it is fully self-contained, you can just download the file and open it on any computer that has a browser installed, no internet connection is needed.

You can use it to exchange data with your phone, exfiltrate data from a VM, or whatever else you use QR codes for.

You can try out the live demo at [qr.15c.me/qr.html](https://qr.15c.me/qr.html).

## customization

At the top of the file are some variables that you can use to customize the QR code.
You can also temporarily override these in your browser console:
```
QR_BORDER_COLOR="#ff0000"
```

Most variables can also be read from local storage, so you can permanently store settings while using the hosted version.
To set a value, you execute something like the following in your browser's console:
```
localStorage.setItem("QR_BORDER_SIZE", "30")
```

## tiny-qr.html

If you have no direct channel to your target system (say you have a Citrix with no internet and clipboard & file upload disabled), you can use `tiny-qr.html`.
It is a very basic QR code generator optimized for size, so that you can transfer it faster using keystroke emulation software (like `xdotool type`):

1. Opening a text editor on the target
2. (Optional) Trying different typing speeds to find the fastest speed at which the transfered contents are not corrupted
3. Tell the keystroke emulation software to type the contents of `tiny-qr.html` and wait for it to finish.
4. Save the editor's contents as a `.html` file
5. Open the file with a browser of your choice

`tiny-qr.html` differs from `qr.html` in the following ways:

- Very short error messages and use of popups instead of an dedicated error message field. No debugging data logged to the console
- No additional features such as drag and drop, clipboard watching, etc
- Simplified layout
- Use of short (mostly 1 letter) variable names, removed all comments
- When alternative syntaxes for something exist, using the shortest one
- The file is less than half the size (12938 bytes vs 29655 bytes at the time of writing)[^3]

[^3]: 2023-07-13, On MacOS. Depending on how you configured git / downloaded the file the line endings may change. That may add or subtract a couple bytes

You can try out the live demo at [qr.15c.me/tiny-qr.html](https://qr.15c.me/tiny-qr.html).

## Known issues

- QR code size limitation: A maximum of 2953 characters can be used with error correction level L, less if you choose better error correction.
- When opening `qr.html` using a file URL in chromium and enabling the clipboard monitoring, a permissions dialog is triggered every time the clipboard is read (every second).

## Additional features

For convenience I have implemented some additional features, that make it easier / faster to generate QR codes from the data you want.
However, these features use APIs that not all browsers support.
My tests were conducted on a Mac and/or Linux computer, Windows support may differ:

Feature | Chrome | Firefox | Safari
---|---|---|---
Watch clipboard | Partial[^1] | With insecure workaround[^2] | No
Paste file | Yes | No | Yes
Drag and drop file | Yes | No | Yes

[^1]: It works with the online version or with locally hosted versions (via `python3 -m http.server`). But it does not work with `file://` URLs, because it does not remember the decision and thus creates a popup every time
[^2]: By typing "about:config" in the URL bar, searching for "dom.events.testing.asyncClipboard" and setting it to true (by double clicking). Afterwards you can reload the page. **Please note, that doing this may have severe security implications, since other websites will be able to read your clipboard, which may contain sensitive information such as passwords.**

### Watch clipboard

The idea is to watch the clipboard constantly (as far as allowed by the browser).

Use case: Allow using guest clipboard on host (via [a script that parses QR code and puts its content's in the clipboard](https://gitlab.com/six-two/bin/-/blob/main/general/copy-qr-code)), when working with a VM, Citrix, or similar system where clipboard sharing may not work/be enabled.

Limits: Browsers only allow clipboard access when the specific tab and window are focused, browser support is terrible (probably since this is easy to abuse if the permission handling is not well implemented).

### Paste file

Copy a file from your OS file explorer and paste it into your browser to generate a QR code for the file's contents.

## Common QR code payloads

Use case | Format | Example
---|---|---
Website | <code><b>url</b></code> | `https://example.com/test/page?abc=def#title`
Phone number | <code>tel:<b>phone</b></code> | `tel:+491234567890`
Send SMS | <code>smsto:<b>phone</b>:<b>message</b></code> | `smsto:+491234567890:Hi there, this is a test SMS`
Email (only address) | <code>mailto:<b>email@address</b></code> | `mailto:user@example.com`
Email | <code>mailto:<b>email@address</b>?subject=<b>subject</b>&body=<b>body</b></code> | `mailto:email@example.com?subject=Test email subject&body=This is a test email`
WiFi Network (SSID) | <code>WIFI:T:WPA;S:<b>name</b>;P:<b>password</b>;;</code> | `WIFI:T:WPA;S:GuestWifi;P:Password123!;;`

## Changelog

- You can provide an initial value for the textbox (and QR code) after a hashtag in the URL like this: <https://qr.15c.me/qr.html#Hello,%20world!%F0%9F%8E%89>
- You can now set values from the browser's console
- Added support for a border around the QR code
- Created a basic minified version (tiny-qr.html)
- Added drag & drop and file copy pasting support
- Added clipboard monitoring support. When the user enables the checkbox, the QR code is updated every time the clipboard changes. This feature can be completely disabled by modifying `qr.html` and setting `SHOW_CLIPBOARD_MONITORING_CONTROLS` to `false`.
- Changed QR code generator library from [qrcodejs](https://github.com/davidshimjs/qrcodejs) to [qr-creator](https://github.com/nimiq/qr-creator), because qrcodejs is no longer maintained, and has problems with Unicode. Even Zhi Yuan's [better maintained fork](https://github.com/zhiyuan-l/qrcodejs) still sometimes has the same problem.

## License
- You can do whatever you want with my own code, since it is licensed under "The Unlicense".
- `qr-creator` is licensed under the MIT License (see https://github.com/nimiq/qr-creator)
