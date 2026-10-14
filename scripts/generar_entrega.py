"""Genera la entrega y un CV sin añadir experiencia o credenciales no documentadas."""
from pathlib import Path
from xml.sax.saxutils import escape
import argparse
import json
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
ASTRO = ROOT
OUT = ROOT / 'entrega'
OUT.mkdir(parents=True, exist_ok=True)
data = json.loads((ROOT / 'src/data/professional-profile.json').read_text())
evidence = json.loads((ROOT / 'docs/evidencias/verificacion-api.json').read_text())
args = argparse.ArgumentParser()
args.add_argument('--portfolio-url', default=data['portfolio'])
opts = args.parse_args()
portfolio = opts.portfolio_url.rstrip('/') + '/'

for name, filename in [('Body', 'DejaVuSans.ttf'), ('Bold', 'DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, '/usr/share/fonts/truetype/dejavu/' + filename))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Bold', italic='Body', boldItalic='Bold')
ink = colors.HexColor('#242330')
accent = colors.HexColor('#534277')
muted = colors.HexColor('#565462')
styles = getSampleStyleSheet()
for name, size, leading in [('BodyText', 9.3, 14), ('Heading1', 23, 28), ('Heading2', 14, 20), ('Heading3', 11, 16)]:
    styles[name].fontName = 'Bold' if name.startswith('Heading') else 'Body'
    styles[name].fontSize = size
    styles[name].leading = leading
    styles[name].textColor = ink
    styles[name].spaceAfter = 9
styles.add(ParagraphStyle('Cover', fontName='Bold', fontSize=30, leading=38, textColor=ink, spaceAfter=22))
styles.add(ParagraphStyle('Small', parent=styles['BodyText'], fontSize=8, leading=12, textColor=muted))
styles.add(ParagraphStyle('Cell', parent=styles['BodyText'], fontSize=8, leading=11.5, spaceAfter=0))

def p(text, style='BodyText'):
    return Paragraph(escape(text), styles[style])

def link(label, url, style='BodyText'):
    return Paragraph(f'<link href="{escape(url, {chr(34): "&quot;"})}" color="#534277"><u>{escape(label)}</u></link>', styles[style])

def heading(title, subtitle=None):
    result = [p(title, 'Heading1')]
    if subtitle:
        result.append(p(subtitle))
    result.append(Spacer(1, 10))
    return result

def footer(canvas, doc):
    canvas.saveState()
    w, _ = A4
    canvas.setStrokeColor(colors.HexColor('#ddd9e5'))
    canvas.line(42, 40, w - 42, 40)
    canvas.setFont('Body', 7)
    canvas.setFillColor(muted)
    canvas.drawString(42, 27, 'Francisco Meza Dastres | Talento Digital | Módulo 9')
    canvas.drawRightString(w - 42, 27, str(doc.page))
    canvas.restoreState()

def document(path, story, margin=42):
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=margin, leftMargin=margin,
        topMargin=48, bottomMargin=56, title=data['title'], author=data['author'])
    doc.build(story, onFirstPage=footer, onLaterPages=footer)

story = [Spacer(1, 60), p('Proyecto del módulo 9', 'Heading2'), p(data['title'], 'Cover'),
    p(data['stage'], 'Heading2'), Spacer(1, 22), p(data['author'], 'Heading1'),
    p('Ingeniero Informático y Desarrollador Full Stack'), p('Santiago, Chile | ' + data['date']),
    Spacer(1, 28), p('Proyectos, evidencia técnica y proyección profesional', 'Heading2'),
    p(data['summary']), Spacer(1, 22), link('Abrir el portafolio y sus proyectos del curso', portfolio + '#formacion'),
    link('Abrir el caso de estudio', portfolio + '#caso-de-estudio'),
    link('Ver investigación y matriz FODA', portfolio + 'desarrollo-profesional/'),
    Spacer(1, 18), p('Empresa elegida: Mercado Libre. Caso de estudio: API de usuarios y pedidos del módulo 8.', 'Small'),
    link('Repositorio del proyecto del módulo 9', 'https://github.com/FranciscoDastres/modulo_9_talento_digital', 'Small'),
    PageBreak()]
story += heading('Investigación de empresa', data['company']['reason'])
rows = [[p('Aspecto', 'Cell'), p('Hallazgo y fuente', 'Cell'), p('Interés técnico personal', 'Cell')]]
for row in data['company']['rows']:
    rows.append([p(row['aspect'], 'Cell'), p(row['finding'] + ' ' + ' '.join(f'[{i}]' for i in row['sources']), 'Cell'), p(row['interest'], 'Cell')])
table = Table(rows, colWidths=[80, 212, 219], repeatRows=1, hAlign='LEFT')
table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e9e2f3')),
    ('VALIGN', (0,0), (-1,-1), 'TOP'), ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10), ('LEFTPADDING', (0,0), (-1,-1), 9),
    ('RIGHTPADDING', (0,0), (-1,-1), 9),
    ('LINEBELOW', (0,0), (-1,-1), .4, colors.HexColor('#d6d0df'))
]))
story += [table, Spacer(1,16), p('Fuentes consultadas el 13 de octubre de 2026. Los artículos técnicos [2] y [3] documentan el enfoque publicado en 2024. No se presupone que todos los equipos usen el mismo stack o metodología.', 'Small'), PageBreak()]
story += heading('Aportes y entrevista', 'Tres formas en que podría aportar al equipo desde una posición junior, con evidencia de mis proyectos.')
for item in data['company']['contributions']:
    story += [p(item['title'], 'Heading2'), p(item['text']), p('Evidencia: ' + item['evidence'], 'Small'), Spacer(1,14)]
story += [p('Tres preguntas para el reclutador', 'Heading2')]
for i, question in enumerate(data['company']['questions'], 1):
    story += [p(f'{i}. {question}'), Spacer(1,6)]
story += [Spacer(1,15), p('El escenario de selección forma parte de la consigna académica. La investigación no afirma que exista una entrevista u oferta confirmada.', 'Small'), PageBreak()]
story += heading('Tres proyectos del curso', 'La portada del portafolio diferencia estos proyectos educativos de mis proyectos personales.')
for item in data['projects']:
    story += [p(item['title'] + ' | ' + item['module'], 'Heading2'), p(item['description']),
        p('Herramientas: ' + item['tools']), p('Aprendizaje: ' + item['learning']),
        link('Repositorio y documentación', item['repository']),
        link(item['demoLabel'], portfolio + item['demo']), Spacer(1,12)]
story += [link('Ver la sección Formación en el portafolio', portfolio + '#formacion'),
    p('Contacto: ' + data['email'], 'Small'), link('Perfil de LinkedIn', data['linkedin'], 'Small'), PageBreak()]
story += heading('Caso de estudio', data['caseStudy']['title'])
for item in data['caseStudy']['sections']:
    story += [p(item['title'], 'Heading3'), p(item['text'])]
story += [p('Métricas de impacto funcional', 'Heading3'),
    p(f"Verificación local del 13 de octubre de 2026: {evidence['pruebas']['aprobadas']}/{evidence['pruebas']['total']} pruebas aprobadas, 0 fallidas y 0 omitidas; {evidence['solicitudes_http_registradas']} solicitudes HTTP registradas. Tras el fallo inducido al crear el perfil, persistieron 0 usuarios incompletos."),
    p('Estas métricas corresponden a escenarios funcionales. No se midieron cobertura de código, carga, latencia ni impacto comercial.', 'Small'),
    link('Leer el caso y consultar la evidencia en el portafolio', portfolio + '#caso-de-estudio'), PageBreak()]
story += heading('Matriz FODA: análisis interno', 'Cinco fortalezas y cinco áreas de mejora orientadas a mi siguiente etapa profesional.')
for group in data['foda'][:2]:
    story += [p(group['title'], 'Heading2')]
    for i,item in enumerate(group['items'],1): story += [p(f'{i}. {item}'), Spacer(1,5)]
    story += [Spacer(1,14)]
story += [PageBreak()]
story += heading('Matriz FODA: análisis externo', 'Cinco amenazas y cinco oportunidades para orientar mi preparación.')
for group in data['foda'][2:]:
    story += [p(group['title'], 'Heading2')]
    for i,item in enumerate(group['items'],1): story += [p(f'{i}. {item}'), Spacer(1,5)]
    story += [Spacer(1,10)]
story += [p(data['marketNote'] + ' Fuente de contexto: [4].', 'Small'), PageBreak()]
story += heading('Próximos pasos y referencias')
for action in data['actionPlan']: story += [p(action), Spacer(1,8)]
story += [Spacer(1,12), p('Fuentes públicas', 'Heading2')]
for source in data['sources']:
    story += [link(f"[{source['id']}] {source['title']}",source['url']), p(source['url'],'Small'), Spacer(1,8)]
story += [p('Consulta: ' + data['date'] + '. Las interpretaciones sobre mi encaje profesional y el FODA son análisis personales.', 'Small'),
    Spacer(1,12), p('Evidencia técnica y contacto', 'Heading2'),
    link('Pruebas de la API en el commit evaluado', data['projects'][2]['repository'] + '/blob/' + evidence['commit_fuente'] + '/tests/api.test.js'),
    link('Registro de verificación de la API', portfolio + 'documents/modulo-9/evidencia-api.json'),
    link('Portafolio personal', data['portfolio']), link('GitHub',data['github']),
    link('LinkedIn',data['linkedin']), link(data['email'], 'mailto:' + data['email'])]
document(OUT / 'proyecto-modulo-9-francisco-meza-dastres.pdf', story)

styles['Small'].spaceAfter = 4
styles['BodyText'].spaceAfter = 6
styles['BodyText'].leading = 12.5
styles['Heading2'].spaceAfter = 7
styles['Heading2'].leading = 18
styles['Heading2'].fontSize = 12
styles['Heading3'].spaceAfter = 5
cv = [p(data['author'], 'Heading1'), p('Ingeniero Informático | Desarrollador Full Stack', 'Heading2'),
    p('Santiago, Chile', 'Small'), link(data['email'], 'mailto:' + data['email'], 'Small'),
    Paragraph(f'<link href="{escape(portfolio)}" color="#534277">Portafolio</link> | <link href="{escape(data["github"])}" color="#534277">GitHub</link> | <link href="{escape(data["linkedin"])}" color="#534277">LinkedIn</link>', styles['Small']),
    Spacer(1,14), p('Perfil profesional','Heading2'),
    p('Desarrollo proyectos web con JavaScript y TypeScript, interfaces y APIs con PostgreSQL. Busco una posición junior donde aportar con tareas de desarrollo, pruebas y documentación, y aprender las prácticas del equipo.'),
    p('Conocimientos aplicados','Heading2'),
    p('JavaScript ES6, TypeScript, HTML, CSS, Astro, React, Node.js, Express, PostgreSQL, SQL, pg, Sequelize, JWT, bcrypt, Git y Postman.'),
    p('Proyectos técnicos del curso','Heading2')]
for item in reversed(data['projects']):
    text = item['description']
    if item['module']=='Módulo 8': text += ' Suite: 10/10 pruebas de integración aprobadas con PostgreSQL real (13/10/2026).'
    cv += [p(item['title'],'Heading3'),p(text),link('Código y documentación',item['repository'],'Small'),Spacer(1,8)]
cv += [p('Formación y desarrollo continuo','Heading2'),
    p('Talento Digital: proyectos formativos de desarrollo web, programación JavaScript y backend con Node.js y PostgreSQL. Portafolio desarrollado con Astro.'),
    p('Objetivo de aprendizaje: profundizar en Java o Go, arquitectura distribuida y automatización de pruebas en CI.','Small')]
document(OUT / 'cv-francisco-meza-dastres.pdf',cv)
destination = ASTRO / 'public/documents/modulo-9'
destination.mkdir(parents=True,exist_ok=True)
for file in [OUT / 'proyecto-modulo-9-francisco-meza-dastres.pdf', OUT / 'cv-francisco-meza-dastres.pdf']:
    shutil.copy2(file,destination/file.name)
print('PDF de proyecto y CV generados en',OUT)
