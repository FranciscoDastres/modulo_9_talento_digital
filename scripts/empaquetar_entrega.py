"""Entrega para la plataforma: documentos y fuente; ZIP y RAR junto a modulo_9."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / '.trabajo/paquete-plataforma'
ARCHIVE = ROOT.parent / 'entrega_modulo_9.zip'
RAR_ARCHIVE = ROOT.parent / 'entrega_modulo_9.rar'
EXCLUDED = {'.git', '.venv', '.vercel', '.astro', '.trabajo', 'node_modules',
            'dist', 'output', 'abp', '__pycache__', '.playwright-cli'}

STAGING.mkdir(parents=True, exist_ok=True)
# La preparación usa únicamente los archivos explícitos de esta entrega.
selected = []
for name in ['proyecto-modulo-9-francisco-meza-dastres.pdf',
             'cv-francisco-meza-dastres.pdf', 'LEEME.md']:
    selected.append((ROOT / 'entrega' / name, Path(name)))
for folder in ['src', 'public', 'scripts', '.github', 'docs', 'entrega']:
    for file in sorted((ROOT / folder).rglob('*')):
        if file.is_file():
            relative = file.relative_to(ROOT)
            if any(part in EXCLUDED for part in relative.parts):
                continue
            if file.name.startswith('.env') or file.suffix in {'.pyc', '.zip', '.rar'}:
                continue
            if relative == Path('docs/consigna-modulo-9.pdf'):
                continue
            if file.is_symlink():
                raise ValueError(f'No se incluyen enlaces simbólicos: {relative}')
            selected.append((file, Path('codigo_fuente') / relative))
for name in ['package.json', 'package-lock.json', 'astro.config.mjs',
             'tailwind.config.mjs', 'tsconfig.json', 'README.md', 'LICENSE', '.gitignore']:
    selected.append((ROOT / name, Path('codigo_fuente') / name))

# Evita arrastrar ficheros de un paquete anterior al RAR.
expected = {target.as_posix() for _, target in selected}
for file in STAGING.rglob('*'):
    if file.is_file() and file.relative_to(STAGING).as_posix() not in expected:
        file.unlink()
for source, relative in selected:
    target = STAGING / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)

zip_temp = ROOT / '.trabajo/entrega_modulo_9-nueva.zip'
with ZipFile(zip_temp, 'w', ZIP_DEFLATED) as archive:
    for _, relative in selected:
        archive.write(STAGING / relative, relative)
with ZipFile(zip_temp) as archive:
    if archive.testzip() is not None:
        raise ValueError('El ZIP no pasó la verificación de integridad')
    for name in archive.namelist():
        if any(part in EXCLUDED for part in Path(name).parts) or Path(name).name.startswith('.env'):
            raise ValueError(f'Archivo local o privado incluido: {name}')
    assert 'codigo_fuente/.github/workflows/pages.yml' in archive.namelist()
    assert 'proyecto-modulo-9-francisco-meza-dastres.pdf' in archive.namelist()
zip_temp.replace(ARCHIVE)
print(f'ZIP verificado: {ARCHIVE} ({len(selected)} archivos)')

rar = shutil.which('rar')
local_rar = ROOT / '.trabajo/rar/usr/bin/rar'
if not rar and local_rar.is_file():
    rar = str(local_rar)
if rar:
    rar_temp = ROOT / '.trabajo/entrega_modulo_9-nueva.rar'
    if rar_temp.exists():
        rar_temp.unlink()
    subprocess.run([rar, 'a', '-r', '-idq', '-m5', str(rar_temp), '.'], cwd=STAGING, check=True)
    subprocess.run([rar, 't', '-idq', str(rar_temp)], check=True)
    rar_temp.replace(RAR_ARCHIVE)
    print(f'RAR verificado: {RAR_ARCHIVE}')
else:
    print('RAR pendiente: instalar rar o preparar .trabajo/rar/usr/bin/rar.')
