<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260428161307 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE acceso (permiso INT NOT NULL, user_id INT NOT NULL, fichero_id INT NOT NULL, INDEX IDX_1268771BA76ED395 (user_id), INDEX IDX_1268771B8E05855 (fichero_id), PRIMARY KEY (user_id, fichero_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE fichero (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(20) NOT NULL, descripcion VARCHAR(50) DEFAULT NULL, data JSON DEFAULT NULL, fecha_creacion DATETIME NOT NULL, fecha_mod DATETIME NOT NULL, ultima_subida_id INT NOT NULL, tipo_fichero_id INT NOT NULL, INDEX IDX_F4E944343336E21D (ultima_subida_id), INDEX IDX_F4E9443499665A7D (tipo_fichero_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE rol (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(20) NOT NULL, descripcion VARCHAR(50) DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE tipos_fichero (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(20) NOT NULL, descripcion VARCHAR(50) DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, rol_id INT NOT NULL, INDEX IDX_8D93D6494BAB96C (rol_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE acceso ADD CONSTRAINT FK_1268771BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE acceso ADD CONSTRAINT FK_1268771B8E05855 FOREIGN KEY (fichero_id) REFERENCES fichero (id)');
        $this->addSql('ALTER TABLE fichero ADD CONSTRAINT FK_F4E944343336E21D FOREIGN KEY (ultima_subida_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE fichero ADD CONSTRAINT FK_F4E9443499665A7D FOREIGN KEY (tipo_fichero_id) REFERENCES tipos_fichero (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6494BAB96C FOREIGN KEY (rol_id) REFERENCES rol (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE acceso DROP FOREIGN KEY FK_1268771BA76ED395');
        $this->addSql('ALTER TABLE acceso DROP FOREIGN KEY FK_1268771B8E05855');
        $this->addSql('ALTER TABLE fichero DROP FOREIGN KEY FK_F4E944343336E21D');
        $this->addSql('ALTER TABLE fichero DROP FOREIGN KEY FK_F4E9443499665A7D');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6494BAB96C');
        $this->addSql('DROP TABLE acceso');
        $this->addSql('DROP TABLE fichero');
        $this->addSql('DROP TABLE rol');
        $this->addSql('DROP TABLE tipos_fichero');
        $this->addSql('DROP TABLE user');
    }
}
