import { NotFoundError } from '@/shared/application/errors';
import type { TextoDeLecturaRepositoryPort } from '../ports/TextoDeLecturaRepositoryPort';
import type { FragmentoRepositoryPort } from '../ports/FragmentoRepositoryPort';
import type { CommentRepositoryPort } from '../ports/CommentRepositoryPort';

export interface FragmentoConComentarios {
  position: number;
  texto_actual: string;
  comentarios: string[];
}

export class GetTextoCompletoConComentarios {
  constructor(
    private textoDeLecturaRepo: TextoDeLecturaRepositoryPort,
    private fragmentoRepo: FragmentoRepositoryPort,
    private commentRepo: CommentRepositoryPort
  ) {}

  async execute(textoLecturaId: string): Promise<{
    nombreTexto?: string;
    fragmentos: FragmentoConComentarios[];
  }> {
    const textoDeLectura = await this.textoDeLecturaRepo.findById(
      textoLecturaId
    );
    if (!textoDeLectura) {
      throw new NotFoundError('Texto de lectura no encontrado');
    }

    const fragmentos = await this.fragmentoRepo.findByTextoLectura(
      textoLecturaId
    );
    const activeFragmentos = fragmentos
      .filter((f) => !f.is_deleted)
      .sort((a, b) => a.position - b.position);

    const fragmentosConComentarios: FragmentoConComentarios[] = [];

    for (const fragmento of activeFragmentos) {
      const comentarios = await this.commentRepo.findByUnit(
        fragmento.fragmento_id
      );

      fragmentosConComentarios.push({
        position: fragmento.position,
        texto_actual: fragmento.texto_actual,
        comentarios: comentarios.map((c) => c.text),
      });
    }

    return {
      nombreTexto: textoDeLectura.nombre,
      fragmentos: fragmentosConComentarios,
    };
  }

  async exportAsMarkdown(textoLecturaId: string): Promise<string> {
    const { nombreTexto, fragmentos } = await this.execute(textoLecturaId);

    let markdown = '';

    if (nombreTexto) {
      markdown += `# ${nombreTexto}\n\n`;
    }

    for (const fragmento of fragmentos) {
      markdown += `${fragmento.texto_actual}\n`;

      if (fragmento.comentarios.length > 0) {
        markdown += '\n';
        for (const comentario of fragmento.comentarios) {
          // Convertir comentario a blockquote
          const lineas = comentario.split('\n');
          for (const linea of lineas) {
            markdown += `> ${linea}\n`;
          }
        }
        markdown += '\n';
      }
    }

    return markdown;
  }
}
