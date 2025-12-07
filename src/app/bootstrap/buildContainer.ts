import { SqlJsDatabaseAdapter } from '@/modules/reader/infrastructure/db/sqljs/SqlJsDatabaseAdapter';
import { DocumentRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/DocumentRepositorySqliteAdapter';
import { UnitRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/UnitRepositorySqliteAdapter';
import { CommentRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/CommentRepositorySqliteAdapter';
import { ReadingStateSqliteAdapter } from '@/modules/reader/infrastructure/repositories/ReadingStateSqliteAdapter';
import { CuadernoRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/CuadernoRepositorySqliteAdapter';
import { TextoOriginalRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/TextoOriginalRepositorySqliteAdapter';
import { TextoDeLecturaRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/TextoDeLecturaRepositorySqliteAdapter';
import { FragmentoRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/FragmentoRepositorySqliteAdapter';
import { EstadoLecturaSqliteAdapter } from '@/modules/reader/infrastructure/repositories/EstadoLecturaSqliteAdapter';

import { CreateDocumentFromText } from '@/modules/reader/application/usecases/CreateDocumentFromText';
import { StartReading } from '@/modules/reader/application/usecases/StartReading';
import { GetCurrentUnit } from '@/modules/reader/application/usecases/GetCurrentUnit';
import { NextUnit } from '@/modules/reader/application/usecases/NextUnit';
import { PrevUnit } from '@/modules/reader/application/usecases/PrevUnit';
import { UpdateUnitText } from '@/modules/reader/application/usecases/UpdateUnitText';
import { DeleteUnit } from '@/modules/reader/application/usecases/DeleteUnit';
import { AddComment } from '@/modules/reader/application/usecases/AddComment';
import { ListComments } from '@/modules/reader/application/usecases/ListComments';
import { SetReadingMode } from '@/modules/reader/application/usecases/SetReadingMode';
import { SetFocusMode } from '@/modules/reader/application/usecases/SetFocusMode';
import { CreateCuaderno } from '@/modules/reader/application/usecases/CreateCuaderno';
import { CreateTextoOriginal } from '@/modules/reader/application/usecases/CreateTextoOriginal';
import { CreateTextoDeLectura } from '@/modules/reader/application/usecases/CreateTextoDeLectura';
import { ListCuadernos } from '@/modules/reader/application/usecases/ListCuadernos';
import { ListTextosDeLectura } from '@/modules/reader/application/usecases/ListTextosDeLectura';
import { GetFragmentoView } from '@/modules/reader/application/usecases/GetFragmentoView';
import { NextFragmento } from '@/modules/reader/application/usecases/NextFragmento';
import { PrevFragmento } from '@/modules/reader/application/usecases/PrevFragmento';
import { UpdateFragmento } from '@/modules/reader/application/usecases/UpdateFragmento';
import { DeleteFragmento } from '@/modules/reader/application/usecases/DeleteFragmento';
import { SetFocusModeV2 } from '@/modules/reader/application/usecases/SetFocusModeV2';
import { UpdateCuaderno } from '@/modules/reader/application/usecases/UpdateCuaderno';
import { UpdateTextoDeLectura } from '@/modules/reader/application/usecases/UpdateTextoDeLectura';
import { GetTextoCompletoConComentarios } from '@/modules/reader/application/usecases/GetTextoCompletoConComentarios';
import { DeleteTextoDeLectura } from '@/modules/reader/application/usecases/DeleteTextoDeLectura';

export interface Container {
  dbAdapter: SqlJsDatabaseAdapter;
  useCases: {
    // Legacy v1 use cases
    createDocumentFromText: CreateDocumentFromText;
    startReading: StartReading;
    getCurrentUnit: GetCurrentUnit;
    nextUnit: NextUnit;
    prevUnit: PrevUnit;
    updateUnitText: UpdateUnitText;
    deleteUnit: DeleteUnit;
    addComment: AddComment;
    listComments: ListComments;
    setReadingMode: SetReadingMode;
    setFocusMode: SetFocusMode;
    // v2 use cases
    createCuaderno: CreateCuaderno;
    createTextoOriginal: CreateTextoOriginal;
    createTextoDeLectura: CreateTextoDeLectura;
    listCuadernos: ListCuadernos;
    listTextosDeLectura: ListTextosDeLectura;
    getFragmentoView: GetFragmentoView;
    nextFragmento: NextFragmento;
    prevFragmento: PrevFragmento;
    updateFragmento: UpdateFragmento;
    deleteFragmento: DeleteFragmento;
    setFocusModeV2: SetFocusModeV2;
    updateCuaderno: UpdateCuaderno;
    updateTextoDeLectura: UpdateTextoDeLectura;
    getTextoCompletoConComentarios: GetTextoCompletoConComentarios;
    deleteTextoDeLectura: DeleteTextoDeLectura;
  };
}

export function buildContainer(dbAdapter: SqlJsDatabaseAdapter): Container {
  const db = dbAdapter.getDatabase();

  // v1 repositories
  const documentRepo = new DocumentRepositorySqliteAdapter(db);
  const unitRepo = new UnitRepositorySqliteAdapter(db);
  const commentRepo = new CommentRepositorySqliteAdapter(db);
  const readingStateRepo = new ReadingStateSqliteAdapter(db);

  // v2 repositories
  const cuadernoRepo = new CuadernoRepositorySqliteAdapter(db);
  const textoOriginalRepo = new TextoOriginalRepositorySqliteAdapter(db);
  const textoDeLecturaRepo = new TextoDeLecturaRepositorySqliteAdapter(db);
  const fragmentoRepo = new FragmentoRepositorySqliteAdapter(db);
  const estadoLecturaRepo = new EstadoLecturaSqliteAdapter(db);

  // v2 use cases (some depend on each other)
  const getFragmentoView = new GetFragmentoView(
    textoDeLecturaRepo,
    textoOriginalRepo,
    cuadernoRepo,
    fragmentoRepo,
    commentRepo,
    estadoLecturaRepo
  );

  return {
    dbAdapter,
    useCases: {
      // Legacy v1 use cases
      createDocumentFromText: new CreateDocumentFromText(
        documentRepo,
        unitRepo,
        readingStateRepo
      ),
      startReading: new StartReading(
        documentRepo,
        unitRepo,
        commentRepo,
        readingStateRepo
      ),
      getCurrentUnit: new GetCurrentUnit(
        documentRepo,
        unitRepo,
        commentRepo,
        readingStateRepo
      ),
      nextUnit: new NextUnit(
        documentRepo,
        unitRepo,
        commentRepo,
        readingStateRepo
      ),
      prevUnit: new PrevUnit(
        documentRepo,
        unitRepo,
        commentRepo,
        readingStateRepo
      ),
      updateUnitText: new UpdateUnitText(unitRepo),
      deleteUnit: new DeleteUnit(unitRepo, readingStateRepo),
      addComment: new AddComment(commentRepo),
      listComments: new ListComments(commentRepo),
      setReadingMode: new SetReadingMode(readingStateRepo),
      setFocusMode: new SetFocusMode(readingStateRepo),
      // v2 use cases
      createCuaderno: new CreateCuaderno(cuadernoRepo, dbAdapter),
      createTextoOriginal: new CreateTextoOriginal(
        textoOriginalRepo,
        cuadernoRepo,
        dbAdapter
      ),
      createTextoDeLectura: new CreateTextoDeLectura(
        textoDeLecturaRepo,
        textoOriginalRepo,
        fragmentoRepo,
        estadoLecturaRepo,
        dbAdapter
      ),
      listCuadernos: new ListCuadernos(cuadernoRepo),
      listTextosDeLectura: new ListTextosDeLectura(textoDeLecturaRepo),
      getFragmentoView,
      nextFragmento: new NextFragmento(
        estadoLecturaRepo,
        fragmentoRepo,
        getFragmentoView,
        dbAdapter
      ),
      prevFragmento: new PrevFragmento(estadoLecturaRepo, getFragmentoView, dbAdapter),
      updateFragmento: new UpdateFragmento(fragmentoRepo, dbAdapter),
      deleteFragmento: new DeleteFragmento(fragmentoRepo, getFragmentoView, dbAdapter),
      setFocusModeV2: new SetFocusModeV2(estadoLecturaRepo, getFragmentoView, dbAdapter),
      updateCuaderno: new UpdateCuaderno(cuadernoRepo, dbAdapter),
      updateTextoDeLectura: new UpdateTextoDeLectura(textoDeLecturaRepo, dbAdapter),
      getTextoCompletoConComentarios: new GetTextoCompletoConComentarios(
        textoDeLecturaRepo,
        fragmentoRepo,
        commentRepo
      ),
      deleteTextoDeLectura: new DeleteTextoDeLectura(
        textoDeLecturaRepo,
        fragmentoRepo,
        estadoLecturaRepo,
        dbAdapter
      ),
    },
  };
}
