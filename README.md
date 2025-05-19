# qr.html

`qr.html` is a self-contained website, that can generate QR codes via [nayuki's QR code generator library](https://github.com/nayuki/QR-Code-generator).
Because it is fully self-contained, you can just download the file and open it on any computer that has a browser installed, no Internet connection is needed.

You can use it to exchange data with your phone, exfiltrate data from a VM, or whatever else you use QR codes for.

You can try out the live demo at [qr.15c.me](https://qr.15c.me/qr.html).

## Customization

At the top of the file are some variables that you can use to customize the QR code.
You can also temporarily override these in your browser console:
```js
QR_BORDER_COLOR="#ff0000"
```

Most variables can also be read from local storage, so you can permanently store settings while using the hosted version.
To set a value, you execute something like the following in your browser's console:
```js
localStorage.setItem("QR_BORDER_SIZE", "30")
```

## qr-zip.html

This is a fork of qr.html, that is designed to transfer as large an input text as possible.

It first converts the input to a ZIP file (using [fflate](https://github.com/101arrowz/ffZlate)).
Then it creates a binary QR code containing the ZIP file.
Since the ZIP file will compress the input text, this allows you to transfer much more text than normally, but at the price of breaking compatibility with normal QR code readers.

You can extract the ZIP file from the QR code using software like [zbarimg](https://github.com/mchehab/zbar).
Make sure to specify that the QR code contains binary data (`-Sbinary` flag), otherwise they might be interpreted as text and corrupted:
```bash
zbarimg -q --raw -Sbinary path/to/qr_code.png > qr-code-data.zip
```

If you unpack the resulting ZIP file (`qr-code-data.zip` in the example above), it will contain a `qr.txt` that contains the text you originally put in the text box.

You can also combine the extracting and unzipping into a single command, which does not create temporary files:
```bash
zbarimg -q --raw -Sbinary path/to/qr_code.png | bsdtar -xOf -
```

## qr-legacy.html

This version uses the [qr-creator](https://github.com/nimiq/qr-creator) engine, which always encodes text as bytes.
While this simplifies things from a programming perspective (QR codes can always contain the exact same number of characters depending on the error correction level, regardless of the contents), this can result in bigger QR codes in some cases.
It is kept around, since it was the previous main version and maybe some of you liked it more or maybe the new engine has some bugs, but will likely not receive much focus in the future.
If you are unsure which version to use, I recommend choosing `qr.html` over this one.

## tiny-qr.html

If you have no direct channel to your target system (say you have a Citrix with no internet and clipboard & file upload disabled), you can use `tiny-qr.html`.
It is a very basic QR code generator optimized for size, so that you can transfer it faster using keystroke emulation software (like `xdotool type`):

1. Opening a text editor on the target
2. (Optional) Trying different typing speeds to find the fastest speed at which the transferred contents are not corrupted
3. Tell the keystroke emulation software to type the contents of `tiny-qr.html` and wait for it to finish.
4. Save the editor's contents as a `.html` file
5. Open the file with a browser of your choice

`tiny-qr.html` differs from `qr.html` in the following ways:

- Very short error messages and use of popups instead of a dedicated error message field. No debugging data logged to the console
- No additional features such as drag and drop, clipboard watching, etc
- Simplified layout
- Use of short (mostly 1 letter) variable names, removed all comments
- When alternative syntaxes for something exist, using the shortest one
- The file is less than half the size (12938 bytes vs 29655 bytes at the time of writing)[^3]

[^3]: 2023-07-13, On macOS. Depending on how you configured git / downloaded the file the line endings may change. That may add or subtract a couple bytes

You can try out the live demo at [qr.15c.me/tiny-qr.html](https://qr.15c.me/tiny-qr.html).

## Known issues

- QR code size limitation: A maximum of 2953 characters can be used with error correction level L, less if you choose better error correction.
- When opening `qr.html` using a file URL in chromium and enabling the clipboard monitoring, a permission dialog is triggered every time the clipboard is read (every second).

## Additional features

For convenience, I have implemented some additional features, that make it easier / faster to generate QR codes from the data you want.
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

You can also store virtual business cards (vCard) in QR codes.
They can be scanned with a phone to add that person as a new contact.
The [vCard format](https://en.wikipedia.org/wiki/VCard#Properties) can be pretty complex, but below is a simple example:
```
BEGIN:VCARD
VERSION:4.0
FN:John Doe
N:Doe;John;;;M.Sc.
BDAY:--0203
GENDER:M
ORG:Example AG;IT Security Tester;Web Application Security Testing
ROLE:IT Security Tester
URL:https://example.com/
EMAIL;TYPE=work:john.doe@example.com
TEL;landline: +49 1234 567 890
TEL;mobile: +41 79 123 45 67
NOTE:At Example AG we provide it security solutions to customers all over the country. Contact us if you ever need a security review or pentest.
END:VCARD
```
 

## Changelog

- 2025-02-09: Added qr-zip.html for transfering larger texts via QR codes.
- 2024-09-14: Added more helpful message when contents do not fit in a QR code with some actions that can help fix it.
- 2024-09-14: Changed the underlying QR code library to one that can handle special input (only numbers or alphanumeric input) more efficiently.
    This allows you to potentially store more information per QR code.
    A copy of the site with the old library is available at `qr-legacy.html`, but will likely not receive much future development.
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
- 
