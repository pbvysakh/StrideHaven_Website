<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

function respond(int $status, bool $success, string $message): void {
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}
function field(string $key, int $maxLength = 10000): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) return '';
    $value = trim($value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $maxLength, 'UTF-8') : substr($value, 0, $maxLength);
}
$name = field('name', 120);
$company = field('company', 160);
$country = field('country', 100);
$industry = field('industry', 120);
$email = field('email', 254);
$phone = field('phone', 50);
$message = field('message', 10000);
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
    respond(422, false, 'Please provide your name, a valid email address, and your requirement.');
}

$maxFileSize = 10 * 1024 * 1024;
$maxTotalSize = 20 * 1024 * 1024;
$maxFiles = 5;
$allowedExtensions = ['pdf','doc','docx','xls','xlsx','csv','txt','jpg','jpeg','png'];
$allowedMimeTypes = [
 'pdf'=>['application/pdf'],
 'doc'=>['application/msword','application/octet-stream','application/CDFV2'],
 'docx'=>['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/zip','application/octet-stream'],
 'xls'=>['application/vnd.ms-excel','application/octet-stream','application/CDFV2'],
 'xlsx'=>['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream'],
 'csv'=>['text/csv','text/plain','application/vnd.ms-excel','application/octet-stream'],
 'txt'=>['text/plain','application/octet-stream'],
 'jpg'=>['image/jpeg'], 'jpeg'=>['image/jpeg'], 'png'=>['image/png']
];
$attachments = [];
$totalSize = 0;
if (isset($_FILES['rfq']) && is_array($_FILES['rfq']['name'] ?? null)) {
    $count = count($_FILES['rfq']['name']);
    if ($count > $maxFiles) respond(422, false, 'Please attach no more than 5 files.');
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    for ($i = 0; $i < $count; $i++) {
        $error = $_FILES['rfq']['error'][$i] ?? UPLOAD_ERR_NO_FILE;
        if ($error === UPLOAD_ERR_NO_FILE) continue;
        if ($error !== UPLOAD_ERR_OK) respond(422, false, 'An attachment could not be uploaded. Please check the file size and try again.');
        $tmp = $_FILES['rfq']['tmp_name'][$i] ?? '';
        $original = basename((string)($_FILES['rfq']['name'][$i] ?? 'attachment'));
        $size = (int)($_FILES['rfq']['size'][$i] ?? 0);
        $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
        if ($size <= 0 || $size > $maxFileSize) respond(422, false, 'Each attachment must be greater than 0 bytes and no larger than 10 MB.');
        $totalSize += $size;
        if ($totalSize > $maxTotalSize) respond(422, false, 'The combined attachment size must be 20 MB or smaller.');
        if (!in_array($ext, $allowedExtensions, true) || !is_uploaded_file($tmp)) respond(422, false, 'One or more attachments use an unsupported file type.');
        $mime = $finfo->file($tmp) ?: 'application/octet-stream';
        if (!in_array($mime, $allowedMimeTypes[$ext] ?? [], true)) respond(422, false, 'The file content does not match its file extension. Please check the attachment.');
        $content = file_get_contents($tmp);
        if ($content === false) respond(500, false, 'The server could not read an attachment. Please try again.');
        $safeName = preg_replace('/[^A-Za-z0-9._ -]/', '_', $original);
        $safeName = trim((string)$safeName, '. ');
        if ($safeName === '') $safeName = 'attachment.' . $ext;
        $attachments[] = ['name'=>$safeName, 'mime'=>$mime, 'content'=>$content];
    }
}

$to = 'info@stride-haven.com';
$subject = '=?UTF-8?B?' . base64_encode('Website enquiry from ' . $name) . '?=';
$body = "A new enquiry was submitted through the Stride Haven website contact form.\n\n"
 . "Name: {$name}\nCompany: " . ($company ?: 'Not provided')
 . "\nCountry: " . ($country ?: 'Not provided') . "\nIndustry: " . ($industry ?: 'Not provided')
 . "\nEmail: {$email}\nPhone: " . ($phone ?: 'Not provided') . "\n\nRequirement:\n{$message}\n\nAttachment count: " . count($attachments) . "\n";
$boundary = '=_StrideHaven_' . bin2hex(random_bytes(16));
$headers = [
 'MIME-Version: 1.0',
 'From: Stride Haven Website <no-reply@stride-haven.com>',
 'Reply-To: ' . $email,
 'Content-Type: multipart/mixed; boundary="' . $boundary . '"'
];
$mimeBody = "--{$boundary}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n{$body}\r\n";
foreach ($attachments as $attachment) {
    $mimeBody .= "--{$boundary}\r\n";
    $mimeBody .= 'Content-Type: ' . $attachment['mime'] . '; name="' . $attachment['name'] . '"' . "\r\n";
    $mimeBody .= "Content-Transfer-Encoding: base64\r\n";
    $mimeBody .= 'Content-Disposition: attachment; filename="' . $attachment['name'] . '"' . "\r\n\r\n";
    $mimeBody .= chunk_split(base64_encode($attachment['content'])) . "\r\n";
}
$mimeBody .= "--{$boundary}--\r\n";
if (!mail($to, $subject, $mimeBody, implode("\r\n", $headers))) {
    error_log('Stride Haven contact form: PHP mail() returned false.');
    respond(500, false, 'We could not send your enquiry right now. Please try again later or email info@stride-haven.com directly.');
}
respond(200, true, 'Thank you. Your enquiry has been sent successfully.');
?>
