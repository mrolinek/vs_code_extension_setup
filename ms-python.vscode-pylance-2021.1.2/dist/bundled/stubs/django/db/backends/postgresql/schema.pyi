from django.db.backends.base.schema import BaseDatabaseSchemaEditor as BaseDatabaseSchemaEditor
from typing import Any

class DatabaseSchemaEditor(BaseDatabaseSchemaEditor):
    sql_create_sequence: str = ...
    sql_delete_sequence: str = ...
    sql_set_sequence_max: str = ...
    sql_set_sequence_owner: str = ...
    sql_create_index: str = ...
    sql_create_index_concurrently: str = ...
    sql_delete_index: str = ...
    sql_delete_index_concurrently: str = ...
    sql_create_column_inline_fk: str = ...
    sql_delete_fk: str = ...
    sql_delete_procedure: str = ...
    def quote_value(self, value: Any): ...
    def add_index(self, model: Any, index: Any, concurrently: bool = ...) -> None: ...
    def remove_index(self, model: Any, index: Any, concurrently: bool = ...) -> None: ...
