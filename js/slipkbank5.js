// slipk.js
// โหมดสลิปปกติ (Standard Mode) - KBANK
// แก้ไข: Export function updateDisplayStandard, IIFE

(function() {
    const fontPath = 'assets/fonts';

    async function loadFonts() {
        const fonts = [
            // SukhumvitSet
            new FontFace('SukhumvitSetThin', `url(${fontPath}/SukhumvitSet-Thin.woff)`),
            // ... (Copy ฟอนต์ทั้งหมดของคุณมาใส่) ...
            new FontFace('kuriousRegular', `url(${fontPath}/kurious-Regular.woff)`),
            new FontFace('kuriousSemiBold', `url(${fontPath}/kurious-semibold.woff)`),
        ];

        return Promise.all(fonts.map(font => font.load().catch(e => console.log(e)))).then(function(loadedFonts) {
            loadedFonts.forEach(function(font) {
                if(font) document.fonts.add(font);
            });
        });
    }

    function init() {
        setCurrentDateTime();
        loadFonts().then(function() {
            document.fonts.ready.then(function() {
                updateDisplayStandard();
            });
        }).catch(function() {
            updateDisplayStandard();
        });
    }

    function setCurrentDateTime() {
        const datetimeInput = document.getElementById('datetime');
        if (!datetimeInput) return;
        const now = new Date();
        const localDateTime = now.toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok', hour12: false });
        const formattedDateTime = localDateTime.replace(' ', 'T');
        if(!datetimeInput.value) datetimeInput.value = formattedDateTime;
    }

    function padZero(num) { return num.toString().padStart(2, '0'); }

    function formatDate(date) {
        if (!date) return '-';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '-';
        const options = { day: 'numeric', month: 'short', year: '2-digit' };
        let formattedDate = d.toLocaleDateString('th-TH', options);
        formattedDate = formattedDate.replace(/ /g, ' ').replace(/\./g, '');
        const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const day = formattedDate.split(' ')[0];
        const month = months[d.getMonth()];
        const year = formattedDate.split(' ')[2];
        return `${day} ${month} ${year}`;
    }

    function generateUniqueID() {
        const dtEl = document.getElementById('datetime');
        const now = dtEl && dtEl.value ? new Date(dtEl.value) : new Date();
        const startDate = new Date("2024-07-24");
        const dayDifference = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        const uniqueDay = (15475 + dayDifference).toString().padStart(6, '0');
        const timePart = `${padZero(now.getHours())}${padZero(now.getMinutes())}${padZero(now.getSeconds())}`;
        const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const bank = document.getElementById('bank') ? document.getElementById('bank').value : '';

        let prefix = "BOR";
        if (bank === "MetaAds") {
            const prefixes = ["APM", "BPM", "CPM", "DPM"];
            prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        } else if (bank === "รหัสพร้อมเพย์" || bank === "พร้อมเพย์วอลเล็ท") {
            const prefixes = ["APP", "BPP", "CPP", "DPP"];
            prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        } else if (bank === "ธ.กสิกรไทย") {
            const prefixes = ["ATF", "BTF", "CTF", "DTF"];
            prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        } else {
            const prefixes = ["AOR", "BOR", "COR", "DOR"];
            prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        }
        return `${uniqueDay}${timePart}${prefix}0${randomPart}`;
    }

    function getInputValue(id, fallback = '') {
        const el = document.getElementById(id);
        return el && el.value ? el.value : fallback;
    }

    // *** ฟังก์ชันวาดโหมด Standard ***
    function updateDisplayStandard() {
        const sendername = getInputValue('sendername', '-');
        const senderaccount = getInputValue('senderaccount', '-');
        const receivername = getInputValue('receivername', '-');
        const receiveraccount = getInputValue('receiveraccount', '-');
        const bank = getInputValue('bank', '-');
        const amount11 = getInputValue('amount11', '-');
        const datetime = getInputValue('datetime', '');
        const selectedImage = getInputValue('imageSelect', '');
        const QRCode = getInputValue('QRCode', '');
        
        const bgSelectEl = document.getElementById('backgroundSelect');
        const backgroundSelect = bgSelectEl ? bgSelectEl.value : '';

        const isPromptPay = bank === 'พร้อมเพย์วอลเล็ท';
        const isMetaAds   = bank === 'MetaAds';

    let bankLogoUrl = '';
    let bankText = '';
    let receiveraccountPositionY = 697.7;
    let receivernamePositionY = 577.0;

    if (isPromptPay) {     // << แทรก isMetaAds
        receiveraccountPositionY = 639.0;
        receivernamePositionY = 577.0;
        bankText = '';
    } else if (isMetaAds) {     // << แทรก isMetaAds
        receiveraccountPositionY = 639.0;
        receivernamePositionY = 1300.0;
        bankText = '';
    } else {
        bankText = bank;
        receiveraccountPositionY = 697.7;
        receivernamePositionY = 577.0;
    }
        switch (bank) {
            case 'ธ.กสิกรไทย':        bankText = 'ธ.กสิกรไทย'; bankLogoUrl = 'assets/image/logo/KBANK.png'; break;
            case 'ธ.กรุงไทย':         bankText = 'ธ.กรุงไทย'; bankLogoUrl = 'assets/image/logo/KTB.png'; break;
            case 'ธ.กรุงเทพ':         bankText = 'ธ.กรุงเทพ'; bankLogoUrl = 'assets/image/logo/BBL1.png'; break;
            case 'ธ.ไทยพาณิชย์':       bankText = 'ธ.ไทยพาณิชย์'; bankLogoUrl = 'assets/image/logo/SCB1.png'; break;
            case 'ธ.กรุงศรีอยุธยา':    bankText = 'ธ.กรุงศรีอยุธยา'; bankLogoUrl = 'assets/image/logo/BAY.png'; break;
            case 'ธ.ทหารไทยธนชาต':    bankText = 'ธ.ทหารไทยธนชาต'; bankLogoUrl = 'assets/image/logo/TTB1.png'; break;
            case 'ธ.ออมสิน':          bankText = 'ธ.ออมสิน'; bankLogoUrl = 'assets/image/logo/O.png'; break;
            case 'ธ.ก.ส.':            bankText = 'ธ.ก.ส.'; bankLogoUrl = 'assets/image/logo/T.png'; break;
            case 'ธ.อาคารสงเคราะห์':   bankText = 'ธ.อาคารสงเคราะห์'; bankLogoUrl = 'assets/image/logo/C.png'; break;
            case 'ธ.เกียรตินาคินภัทร':  bankText = 'ธ.เกียรตินาคินภัทร'; bankLogoUrl = 'assets/image/logo/K.png'; break;
            case 'ธ.ซีไอเอ็มบี':       bankText = 'ธ.ซีไอเอ็มบี'; bankLogoUrl = 'assets/image/logo/CIMB.png'; break;
            case 'ธ.ยูโอบี':           bankText = 'ธ.ยูโอบี'; bankLogoUrl = 'assets/image/logo/UOB.png'; break;
            case 'ธ.แลนด์ แอนด์ เฮ้าส์': bankText = 'ธ.แลนด์ แอนด์ เฮ้าส์'; bankLogoUrl = 'assets/image/logo/LHBANK.png'; break;
            case 'ธ.ไอซีบีซี':         bankText = 'ธ.ไอซีบีซี'; bankLogoUrl = 'assets/image/logo/ICBC.png'; break;
            case 'รหัสพร้อมเพย์':      bankText = 'รหัสพร้อมเพย์'; bankLogoUrl = 'assets/image/logo/P-KBANK.png'; break;
            case 'พร้อมเพย์วอลเล็ท':   bankLogoUrl = 'assets/image/logo/P-KBANK.png'; break;
            case 'MetaAds':           bankLogoUrl = 'assets/image/logo/Meta.png'; break;
        }

        const formattedDate = formatDate(datetime);
        const d = new Date(datetime);
        const formattedTime = isNaN(d.getTime()) ? '' : d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let backgroundImageSrc = backgroundSelect;
        if (!backgroundImageSrc) backgroundImageSrc = 'assets/image/bs/N-K1.jpg';

        const backgroundImage = new Image();
        backgroundImage.src = backgroundImageSrc;
        backgroundImage.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const bankLogo = new Image();
        bankLogo.src = bankLogoUrl;
        bankLogo.onload = function() {
            ctx.drawImage(bankLogo, 34.6, 526.7, 157, 157); // Adjust position and size as needed
            
            // Draw text with custom styles
            drawText(ctx, `${formattedDate}  ${formattedTime} น.`, 68.9, 136.6, 37.5, 'kuriousRegular', '#4e4e4e', 'left', 1.5,0, 0, 0, 800, 0);

            drawText(ctx, `${sendername}`, 238.9, 272.0, 39.3, 'kuriousSemiBold', '#4e4e4e', 'left', 1.5, 3, 0, 0, 800,0);
            drawText(ctx, `ธ.กสิกรไทย`, 238.9, 333.6, 37.5, 'kuriousRegular', '#545454', 'left', 1.5, 2, 0, 0, 500, 0);
            drawText(ctx, `${senderaccount}`, 238.9, 392.5, 37.5, 'kuriousRegular', '#545454', 'left', 1.5, 1, 0, 0, 500, 0);
            
            drawText(ctx, `${receivername}`, 238.9, receivernamePositionY, 39.3, 'kuriousSemiBold', '#4e4e4e', 'left', 1.5, 3, 0, 0, 800, 0);
            drawText(ctx, bankText, 238.9, 639.0, 37.5, 'kuriousRegular', '#545454', 'left', 1.5, 2, 0, 0, 500, 0);
            drawText(ctx, `${receiveraccount}`, 238.9, receiveraccountPositionY, 37.5, 'kuriousRegular', '#545454', 'left', 1.5, 1, 0, 0, 500, 0);
            if (isMetaAds) {
                         drawText(ctx, `${receiveraccount}`, 238.9, 697.7,
                                 37.5, 'kuriousRegular', '#545454', 'left',
                                 1.5, 1, 0, 0, 500, 0);
            drawText(ctx, `Meta Ads (KGP)`, 238.9, 577.00, 39.3, 'kuriousSemiBold', '#4e4e4e', 'left', 1.5, 3, 0, 0, 800, 0);
                     }
            drawText(ctx, `${generateUniqueID()}`, 459, 885.4, 35.63, 'kuriousRegular', '#575757', 'right', 1.5, 3, 0, 0, 500, -2);
            drawText(ctx, `${amount11} บาท`, 459, 1003.6, 38.44, 'kuriousSemiBold', '#4b4b4b', 'right', 1.5, 3, 0, 0, 500, -2);
            drawText(ctx, `0.00 บาท`, 459, 1124.2, 38.44, 'kuriousSemiBold', '#4b4b4b', 'right', 1.5, 3, 0, 0, 500, -2);
            drawText(ctx, `${QRCode}`, 238.9, 599.0, 33, 'kuriousSemiBold', '#4e4e4e', 'left', 1.5, 5, 0, 0, 500, 0);
            drawImage(ctx, 'assets/image/logo/KBANK.png', 34.6, 222, 157, 157);  
        
            // Draw the selected image
            if (selectedImage) {
                const customImage = new Image();
                customImage.src = selectedImage;
                customImage.onload = function() {
                    ctx.drawImage(customImage, 0, 0, 842, 1200); // Adjust the position and size as needed
                }
            }
        }
        };
    }

    function drawText(ctx, text, x, y, fontSize, fontFamily, color, align, lineHeight, maxLines, shadowColor, shadowBlur, maxWidth, letterSpacing) {
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        const paragraphs = text.split('<br>');
        let currentY = y;
        paragraphs.forEach(paragraph => {
            // ... (Logic ตัดคำภาษาไทยเหมือนเดิม) ...
            const lines = [paragraph]; // Simplified for brevity, use full logic if needed
            lines.forEach((line, index) => {
                let currentX = x;
                if (align === 'center') {
                    currentX = x - (ctx.measureText(line).width / 2) - ((line.length - 1) * letterSpacing) / 2;
                } else if (align === 'right') {
                    currentX = x - ctx.measureText(line).width - ((line.length - 1) * letterSpacing);
                }
                drawTextLine(ctx, line, currentX, currentY, letterSpacing);
                currentY += lineHeight;
            });
        });
    }

    function drawTextLine(ctx, text, x, y, letterSpacing) {
        if (!letterSpacing) { ctx.fillText(text, x, y); return; }
        const characters = text.split('');
        let currentPosition = x;
        characters.forEach((char, index) => {
            // ... (Logic สระลอย/วรรณยุกต์) ...
            ctx.fillText(char, currentPosition, y);
            const charWidth = ctx.measureText(char).width;
            currentPosition += charWidth + letterSpacing;
        });
    }

    function downloadImage() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'slip.png';
        link.click();
    }

    function drawImage(ctx, imageUrl, x, y, width, height) {
        const image = new Image();
        image.src = imageUrl;
        image.onload = function() { ctx.drawImage(image, x, y, width, height); };
    }

    // ========= EXPORT =========
    window.initStandard = init;
    window.updateDisplayStandard = updateDisplayStandard;
    window.downloadImage = downloadImage;

})();