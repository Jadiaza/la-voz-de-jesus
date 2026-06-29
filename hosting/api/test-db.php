<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

try {
  $pdo = lvj_db();
  $emisora = lvj_first(
    $pdo,
    'SELECT id, nombre_emisora, eslogan, pais FROM lvj_cfg_emisora ORDER BY id ASC LIMIT 1',
  );

  lvj_json_response([
    'ok' => true,
    'message' => 'Conexion MySQL correcta',
    'emisora' => $emisora,
  ]);
} catch (Throwable $error) {
  lvj_json_response([
    'ok' => false,
    'error' => $error->getMessage(),
  ], 500);
}
