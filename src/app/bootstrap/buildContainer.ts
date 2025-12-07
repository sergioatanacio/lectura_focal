import { SqlJsDatabaseAdapter } from '@/modules/reader/infrastructure/db/sqljs/SqlJsDatabaseAdapter';
import { DocumentRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/DocumentRepositorySqliteAdapter';
import { UnitRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/UnitRepositorySqliteAdapter';
import { CommentRepositorySqliteAdapter } from '@/modules/reader/infrastructure/repositories/CommentRepositorySqliteAdapter';
import { ReadingStateSqliteAdapter } from '@/modules/reader/infrastructure/repositories/ReadingStateSqliteAdapter';

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

export interface Container {
  dbAdapter: SqlJsDatabaseAdapter;
  useCases: {
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
  };
}

export function buildContainer(dbAdapter: SqlJsDatabaseAdapter): Container {
  const db = dbAdapter.getDatabase();

  const documentRepo = new DocumentRepositorySqliteAdapter(db);
  const unitRepo = new UnitRepositorySqliteAdapter(db);
  const commentRepo = new CommentRepositorySqliteAdapter(db);
  const readingStateRepo = new ReadingStateSqliteAdapter(db);

  return {
    dbAdapter,
    useCases: {
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
    },
  };
}
